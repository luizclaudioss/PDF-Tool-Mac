<p align="center">
  <img src="assets/icon_1024.png" width="120" height="120" alt="PDF Tool Icon" />
</p>

<h1 align="center">PDF Tool para macOS</h1>

<p align="center">
  <strong>Utilitário nativo, elegante e 100% offline para manipular, organizar e converter arquivos PDF no Mac.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/macOS-11.0%2B%20(Big%20Sur%20ou%20superior)-black?style=flat-square&logo=apple&logoColor=white" alt="macOS Version" />
  <img src="https://img.shields.io/badge/Arquitetura-Universal%20(Apple%20Silicon%20%2B%20Intel)-blue?style=flat-square" alt="Universal Binary" />
  <img src="https://img.shields.io/badge/Tamanho-~2.5%20MB-success?style=flat-square" alt="Tamanho" />
  <img src="https://img.shields.io/badge/Privacidade-100%25%20Offline-green?style=flat-square" alt="Privacidade" />
  <img src="https://img.shields.io/badge/Versão-1.0.1-orange?style=flat-square" alt="Versão" />
</p>

---

## 🎯 Por que o PDF Tool?

Ao contrário da maioria dos serviços de PDF online que exigem o upload de seus dados confidenciais para servidores na nuvem, o **PDF Tool** roda **100% localmente no seu Mac**.

Seus extratos bancários, contratos, faturas e documentos pessoais nunca saem do seu computador.

* ⚡ **Ultra Leve e Rápido:** Binário Universal nativo ocupando menos de 3 MB.
* 🔒 **Segurança Total:** Zero conexões externas, sem rastreamento e sem dependência de internet.
* 🖥️ **Design Moderno:** Interface polida com ícones vetoriais modernos (estilo *SF Symbols*) e integração nativa com o macOS.
* 📂 **Fluxo Sem Atrito:** Diálogo nativo *"Salvar Como..."* e atalho flutuante para abrir o arquivo ou visualizá-lo diretamente no Finder com um clique.

---

## 🧰 Ferramentas Disponíveis

| Ferramenta | Descrição |
| :--- | :--- |
| **Combinar PDF** | Junte múltiplos PDFs em um só arquivo. Reordene arrastando cartões ou usando setas, com opção de rotação individual. |
| **Extrair Páginas** | Selecione visualmente as páginas desejadas e crie um novo PDF apenas com elas. |
| **Girar PDF** | Gire páginas individuais em 90°, 180° ou 270°, ou use os botões rápidos para girar todas de uma só vez. |
| **Remover Páginas** | Marque páginas para exclusão com visualização instantânea em vermelho e botão de restauração. |
| **PDF para JPG** | Converta páginas selecionadas em imagens JPG de alta qualidade (em lote ou arquivo único). |
| **JPG para PDF** | Transforme fotos e imagens em um documento PDF, escolhendo a orientação das páginas (*Vertical* ou *Horizontal*). |

---

## 💡 Destaques de Usabilidade

* 🔓 **Desbloqueio de PDFs Protegidos:** Caixa de diálogo embutida para inserir a senha de documentos criptografados (comprovantes bancários, faturas, etc.) sem sair do programa.
* 🚀 **Toast de Sucesso Inteligente:** Ao salvar, receba a confirmação com botões para **Abrir o Documento** ou **Revelar no Finder**, retornando à tela inicial automaticamente.
* ⌨️ **Atalhos de Teclado Nativos:**
  * <kbd>⌘</kbd> + <kbd>O</kbd>: Selecionar / Importar arquivo.
  * <kbd>⌘</kbd> + <kbd>S</kbd>: Executar ação e salvar.
  * <kbd>⌘</kbd> + <kbd>W</kbd>: Voltar à lista de ferramentas.
  * <kbd>⌘</kbd> + <kbd>+</kbd> / <kbd>-</kbd>: Ajustar zoom da tela.

---

## 📥 Como Baixar e Instalar

### Opção 1: Baixar o Aplicativo Pronto (Recomendado)
1. Acesse a aba de **[Releases](https://github.com/luirdi/PDF-Tool-Mac/releases)**.
2. Baixe o arquivo `PDF-Tool-v1.0.1.zip`.
3. Dê dois cliques para descompactar.
4. Arraste o **PDF Tool.app** para a sua pasta **Aplicativos** (`/Applications`).

> [!TIP]
> **Primeira abertura no macOS:**  
> Por ser um aplicativo independente distribuído fora da Mac App Store, ao abrir pela primeira vez, se o macOS exibir o aviso de desenvolvedor não verificado:  
> Clique com o **botão direito** no aplicativo ➔ selecione **Abrir** ➔ clique em **Abrir**.  
> *(Você só precisa fazer isso uma única vez).*

---

### Opção 2: Compilar a partir do Código-Fonte

Pré-requisitos: macOS com Xcode Command Line Tools instalado (`xcode-select --install`).

```bash
# 1. Clone este repositório
git clone https://github.com/luirdi/PDF-Tool-Mac.git
cd PDF-Tool-Mac

# 2. Execute o script de compilação automatizada
./build.sh

# 3. Abra o app ou instale na sua pasta de Aplicativos
open "./build/PDF Tool.app"
cp -R "./build/PDF Tool.app" /Applications/
```

---

## 🧱 Arquitetura e Estrutura do Projeto

```text
PDF-Tool-Mac/
├── assets/                  # Ícone oficial em alta resolução (AppIcon.icns e PNG)
├── mac/
│   ├── main.swift           # Código nativo Swift (janela NSWindow, WKWebView e menus)
│   └── Info.plist           # Configuração de versão, metadados e autoria
├── src/
│   ├── index.html           # Estrutura da interface
│   ├── css/
│   │   └── app.css          # Design responsivo com tokens visuais do macOS
│   ├── js/
│   │   └── app.js           # Lógica das ferramentas e comunicação nativa
│   └── vendor/              # Bibliotecas locais offline (pdf-lib, pdf.js, pdf.worker)
├── build.sh                 # Script universal de build (Apple Silicon + Intel)
└── README.md
```

---

## 👨‍💻 Autor

Desenvolvido por **Luiz Cláudio**

Se este projeto foi útil para você, deixe uma ⭐️ no repositório!
