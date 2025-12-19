# Instruções para Corrigir o Erro de CORS no Upload de Arquivos

Você está enfrentando um erro de permissão (CORS) ao tentar fazer upload de arquivos. Isso acontece porque o bucket do Firebase Storage, por padrão, bloqueia uploads diretos via navegador de domínios externos (como o localhost).

Para corrigir isso, você precisa aplicar a configuração que já criei no arquivo `cors.json` ao seu bucket.

## Como resolver:

1.  **Descubra o nome correto do seu Bucket:**
    *   Acesse o [Console do Firebase](https://console.firebase.google.com/).
    *   Entre no seu projeto **rrpsico-login**.
    *   Vá em **Criação** > **Storage**.
    *   Copie o endereço que aparece no topo, geralmente começa com `gs://` (ex: `gs://rrpsico-login.appspot.com`).

2.  **Execute o comando:**
    *   Abra o terminal na pasta do projeto.
    *   Execute o seguinte comando (substituindo pelo nome do seu bucket):

    ```bash
    gsutil cors set cors.json gs://SEU_NOME_DO_BUCKET_AQUI
    ```

    *   **Se você não tiver o `gsutil` instalado:**
        *   Acesse o [Google Cloud Console](https://console.cloud.google.com/).
        *   Selecione o projeto correto.
        *   Clique no ícone **Activate Cloud Shell** (canto superior direito).
        *   Crie o arquivo `cors.json`: `nano cors.json` e cole o conteúdo:
          ```json
          [
            {
              "origin": ["*"],
              "method": ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS"],
              "responseHeader": ["*"],
              "maxAgeSeconds": 3600
            }
          ]
          ```
        *   Salve (Ctrl+O, Enter) e saia (Ctrl+X).
        *   Rode o comando: `gsutil cors set cors.json gs://SEU_NOME_DO_BUCKET_AQUI`

Após feito isso, aguarde alguns segundos e tente o upload novamente.
