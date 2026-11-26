# Política de Segurança

## Versões suportadas
Apenas a versão mais recente da branch `main` recebe correções de segurança.

## Como relatar uma vulnerabilidade
**Não abra issues públicas para vulnerabilidades.**

Relate de forma privada pelo GitHub Security Advisories:
**Security → Advisories → Report a vulnerability** neste repositório.

Inclua: descrição, passos para reproduzir, impacto estimado e, se possível, sugestão de correção.
Responderemos em até 5 dias úteis e manteremos você informado até a correção ser publicada.

## Boas práticas para contribuidores
- Nunca commite segredos (`.env`, tokens, chaves de API). Use `.env.example` como referência.
- Variáveis `EXPO_PUBLIC_*` são embutidas no bundle e **não** devem conter segredos.
