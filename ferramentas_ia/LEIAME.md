# LLMs grátis em cadeia (da melhor para a pior)

`llm_gratis.py` pergunta ao melhor serviço grátis disponível. Quando a cota de um acaba (erro 429), ele fica pausado e o próximo da lista assume, sozinho.

| # | Serviço | Modelos (em ordem) | Precisa de chave? | Limite grátis |
|---|---|---|---|---|
| 1 | Google Gemini | gemini-3.8-flash → 3.6-flash → 2.5-flash → 3.5-flash-lite | sim (aistudio.google.com/app/apikey) | definido na conta |
| 2 | NVIDIA NIM | nemotron-3-ultra-550b | sim (build.nvidia.com) | varia |
| 3 | Groq | gpt-oss-120b → qwen3.8-27b → gpt-oss-20b | sim (console.groq.com/keys) | 1.000 pedidos/dia por modelo |
| 4 | OpenRouter | nemotron-3-ultra:free → gemma-4-31b:free | sim (openrouter.ai/keys) | 50 pedidos/dia |
| 5 | Kilo Code | nemotron-3-ultra:free → kilo-auto/free | **não** | 200 pedidos/hora |
| 6 | OVHcloud | Qwen3.5-397B → gpt-oss-120b → Llama 3.3 70B | **não** | 2 pedidos/minuto |

Fora da lista: Cohere (grátis só para uso não comercial), Aion Labs (exige cartão), SiliconFlow/ModelScope (identidade chinesa), Gonka (SMS), LLM7 (sem plano grátis documentado), AxForge (depois cobra).

## Uso
```bash
python3 ferramentas_ia/llm_gratis.py "sua pergunta"
python3 ferramentas_ia/llm_gratis.py --status     # o que está configurado / pausado
python3 ferramentas_ia/llm_gratis.py --testar     # manda "oi" para cada um
```
```python
from llm_gratis import perguntar
texto, quem = perguntar("Sugira 10 títulos para um vídeo sobre...", sistema="Responda em português do Brasil.")
```

## Chaves (nunca no Git, nunca no chat)
- **Na nuvem do Claude Code:** são salvas como segredo do ambiente (formulário seguro); o proxy as injeta. O script funciona sem variável de ambiente.
- **No seu PC:** `export GEMINI_API_KEY=...` (e NVIDIA_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY), ou no Windows `setx GEMINI_API_KEY "..."`.

Avisos: no plano grátis do Gemini o Google pode usar os textos para melhorar produtos; não mande nada sigiloso. Limites e modelos grátis mudam com frequência — se um modelo sumir, troque em `llm_gratis.json`. Fonte: skill `free-llm-apis` (mnfst/awesome-free-llm-apis, dados de 15/11/2026).
