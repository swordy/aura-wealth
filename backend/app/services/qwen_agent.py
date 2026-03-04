"""
Qwen LLM integration for document analysis.
Creates a session, sends system + user prompts, streams SSE response,
parses structured extraction results.
"""

import json
import logging

import httpx

from app.config import settings
from app.models.document import ExtractionResult

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
Tu es un agent d'analyse patrimoniale expert. Analyse le document fourni et extrais \
TOUTES les données financières pertinentes pour un tableau de bord patrimonial français.

DOMAINES ET CHAMPS DISPONIBLES :

1. dashboard (Synthèse patrimoniale)
   - patrimoine_brut (number, €) : valeur totale des actifs
   - patrimoine_net (number, €) : patrimoine brut - dettes
   - projection_10ans (number, €) : projection à 10 ans
   - projection_taux (number, %) : taux de projection
   - rendement_global_pct (number, %)
   - rendement_global_eur (number, €)
   - repartition.immobilier.valeur (number, €)
   - repartition.pea.valeur (number, €)
   - repartition.crypto.valeur (number, €)
   - repartition.epargne.valeur (number, €)
   - repartition.liquidites.valeur (number, €)
   - tresorerie.comptes_courants (number, €)
   - tresorerie.epargne_precaution (number, €)
   - endettement.crd (number, €) : capital restant dû total
   - endettement.taux_endettement (number, %)
   - endettement.capacite_residuelle (number, €)
   - moteur_immo.revenus_locatifs_annuels (number, €)
   - moteur_immo.revenus_locatifs_mensuels (number, €)
   - moteur_immo.cashflow_net_mensuel (number, €)
   - fiscal.tmi (number, tranche : 0, 11, 30, 41 ou 45)
   - fiscal.ir (number, €) : impôt sur le revenu
   - fiscal.ps (number, €) : prélèvements sociaux
   - fiscal.tf (number, €) : taxe foncière
   - fiscal.total_annuel (number, €)

2. epargne (Épargne)
   - total (number, €) : total épargne réglementée
   - livrets[] (array d'objets) : chaque élément {nom, solde, plafond, taux, statut}
   - retraite.per.solde (number, €)
   - retraite.percol.solde (number, €)
   - retraite.total (number, €)
   - assurance_vie.solde (number, €)
   - assurance_vie.fonds_euros_pct (number, %)
   - assurance_vie.uc_pct (number, %)
   - assurance_vie.rendement_annuel (number, %)
   - prevoyance.capital_deces (number, €)
   - prevoyance.ij_mensuelle (number, €)

3. bourse (Investissements boursiers)
   - actifs_financiers (number, €)
   - pea.total (number, €)
   - pea.ytd_pct (number, %)
   - pea.positions[] (array) : {nom, ticker, valeur, poids, ytd, pv_eur}
   - cto.total (number, €)
   - cto.positions[] (array) : {nom, ticker, valeur, poids, ytd, pv_eur}
   - crypto_total (number, €)
   - cryptos[] (array) : {nom, symbol, valeur, poids, ytd}

4. immobilier (Patrimoine immobilier)
   - valeur_venale (number, €) : valeur totale immobilier
   - rendement_brut (number, %)
   - cashflow_net_mensuel (number, €)
   - crd_total (number, €) : total capital restant dû
   - lmnp[] (array) : {nom, type, valeur, loyer_mensuel, rendement, statut, crd, amortissement_restant}
   - sci.valeur (number, €)
   - sci.regime (string : "IS" ou "IR")
   - sci.crd (number, €)
   - scpis[] (array) : {nom, parts, valeur, rendement, delai_jouissance}
   - residence_principale.valeur (number, €)
   - residence_principale.crd (number, €)

5. private_equity (Private Equity)
   - investi (number, €) : total investi
   - valorisation (number, €) : valorisation actuelle
   - tvpi (number) : ratio Total Value to Paid-In
   - irr_estime (number, %)
   - fonds[] (array) : {nom, vintage, investi, valorisation, tvpi, statut}

DONNÉES ACTUELLES DE L'UTILISATEUR :
{current_data}

INSTRUCTIONS :
- Analyse le document exhaustivement. Extrais TOUTES les données financières trouvées.
- Retourne UNIQUEMENT un JSON array strict (pas de texte avant/après).
- Chaque élément du array : {{"domain": "...", "field_path": "...", "field_label": "...", \
"new_value": ..., "action": "create"|"update", "confidence": 0.0-1.0}}
- "action": "create" pour un nouvel élément qui n'existe pas, "update" pour modifier une valeur existante
- "field_path" utilise la notation pointée (ex: "fiscal.ir", "livrets", "pea.positions")
- Pour les arrays (livrets, positions, fonds, lmnp, scpis, cryptos), \
"new_value" est l'objet complet à ajouter
- "confidence" : 1.0 = donnée exacte trouvée dans le document, 0.5-0.9 = déduite/calculée, \
< 0.5 = estimation
- Si aucune donnée financière n'est trouvée, retourne un array vide : []
"""


async def analyze_document(
    raw_text: str,
    current_data: dict[str, dict],
    content_type: str,
) -> list[ExtractionResult]:
    """Analyze document text using Qwen LLM and return extraction results."""
    base_url = settings.qwen_base_url
    session_id: str | None = None

    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            # 1. Create session
            resp = await client.post(f"{base_url}/api/sessions")
            resp.raise_for_status()
            session_data = resp.json()
            session_id = session_data.get("id") or session_data.get("session_id")
            if not session_id:
                raise ValueError(f"No session ID in response: {session_data}")

            # 2. Build prompt
            current_json = json.dumps(current_data, indent=2, ensure_ascii=False, default=str)
            system = SYSTEM_PROMPT.replace("{current_data}", current_json)

            user_msg = f"Voici le contenu du document ({content_type}) à analyser :\n\n{raw_text}"

            # 3. Stream response via SSE
            full_response = await _stream_message(client, base_url, session_id, system, user_msg)

            # 4. Parse JSON from response
            return _parse_results(full_response, current_data)

        finally:
            # 5. Cleanup session
            if session_id:
                try:
                    await client.delete(f"{base_url}/api/sessions/{session_id}")
                except Exception:
                    pass


async def _stream_message(
    client: httpx.AsyncClient,
    base_url: str,
    session_id: str,
    system_prompt: str,
    user_message: str,
) -> str:
    """Send message and collect SSE stream response."""
    payload = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    }

    chunks: list[str] = []

    async with client.stream(
        "POST",
        f"{base_url}/api/sessions/{session_id}/messages/stream",
        json=payload,
        timeout=120.0,
    ) as response:
        response.raise_for_status()
        async for line in response.aiter_lines():
            if not line or not line.startswith("data: "):
                continue

            data_str = line[6:]  # strip "data: "
            if data_str.strip() == "[DONE]":
                break

            try:
                event = json.loads(data_str)
            except json.JSONDecodeError:
                continue

            event_type = event.get("type", "")
            content = event.get("content", "")

            # Filter status lines
            if "[__STATUS__]" in content:
                continue

            if event_type == "chunk" and content:
                chunks.append(content)
            elif event_type == "done":
                break
            elif event_type == "error":
                raise RuntimeError(f"Qwen error: {content}")

    return "".join(chunks)


def _parse_results(
    raw_response: str,
    current_data: dict[str, dict],
) -> list[ExtractionResult]:
    """Parse LLM response into ExtractionResult list."""
    # Find JSON array in response (may have markdown fences)
    text = raw_response.strip()
    if "```json" in text:
        text = text.split("```json", 1)[1]
        text = text.split("```", 1)[0]
    elif "```" in text:
        text = text.split("```", 1)[1]
        text = text.split("```", 1)[0]

    # Find array boundaries
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        logger.warning("No JSON array found in LLM response")
        return []

    json_str = text[start : end + 1]

    try:
        items = json.loads(json_str)
    except json.JSONDecodeError as e:
        logger.error("Failed to parse LLM JSON: %s", e)
        return []

    if not isinstance(items, list):
        return []

    results: list[ExtractionResult] = []
    for item in items:
        if not isinstance(item, dict):
            continue
        domain = item.get("domain", "")
        field_path = item.get("field_path", "")
        if not domain or not field_path:
            continue

        # Look up current value
        current_value = _get_current_value(current_data, domain, field_path)

        results.append(
            ExtractionResult(
                domain=domain,
                field_path=field_path,
                field_label=item.get("field_label", field_path),
                new_value=item.get("new_value"),
                current_value=current_value,
                action=item.get("action", "create"),
                confidence=float(item.get("confidence", 0.5)),
            )
        )

    return results


def _get_current_value(data: dict[str, dict], domain: str, field_path: str) -> object:
    """Get current value from user data using dot-notation path."""
    domain_data = data.get(domain)
    if domain_data is None:
        return None

    keys = field_path.split(".")
    current: object = domain_data
    for key in keys:
        if isinstance(current, dict):
            current = current.get(key)
        elif isinstance(current, list) and key.isdigit():
            idx = int(key)
            current = current[idx] if 0 <= idx < len(current) else None
        else:
            return None
    return current
