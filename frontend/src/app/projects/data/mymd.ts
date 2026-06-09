import type { Project } from "./types";

const MYMD_README = `# MyMD: Custom Markup Language Compiler

> **A desktop-grade markup editor built from scratch using Compiler Construction principles.**
> *Featuring Live AST Visualization & LaTeX Export.*

## 💡 The Core Concept
MyMD is not just a text editor; it is a full-fledged **Compiler** frontend.
While most markdown editors rely on regex replacement (which is fragile), MyMD defines a formal **Context-Free Grammar (CFG)** using ANTLR4. It parses your text into a Concrete Syntax Tree (CST), transforms it into an Abstract Syntax Tree (AST), and compiles it into multiple targets (HTML, LaTeX).

## 🚀 Tech Stack

### Core Compiler
* **Lexer & Parser**: ANTLR 4.13 (Adaptive LL(*) parsing)
* **Language**: Java 21 (OpenJDK)
* **Intermediate Representation**: Pandoc JSON AST
* **Unit Testing**: JUnit 5

### Application Layer
* **GUI Framework**: JavaFX (OpenJFX) with WebView
* **Build System**: Maven
* **Integration**: Pandoc CLI (Backend Renderer)

## 🛠️ Architecture Pipeline

The system follows a classic compiler pipeline architecture:

\`\`\`text
[ Source Code (.mymd) ]
        │
        ▼
╭──────────────────────╮
│       LEXER          │ ──▶  Generate Tokens
╰──────────────────────╯
        │
        ▼
╭──────────────────────╮
│    PARSER (ANTLR)    │ ──▶  Concrete Syntax Tree (CST)
╰──────────────────────╯      (Raw Grammar Nodes)
        │
        ▼
╭──────────────────────╮
│     AST VISITOR      │ ──▶  Pandoc JSON AST
╰──────────────────────╯      (Abstract Structure)
        │
        ▼
╭──────────────────────╮
│    PANDOC BACKEND    │ ──▶  Final Compilation
╰──────────────────────╯
        │
        ├───────────────────────┐
        ▼                       ▼
 [ Target: HTML ]        [ Target: LaTeX ]
   (Live Preview)          (Academic PDF)
\`\`\`

## ✨ Key Features
* **Formal Grammar Definition**: A robust \`.g4\` grammar file defining recursive rules for nested styles (e.g., **Bold inside *Italic***).
* **Split-Pane Live Preview**: Real-time rendering via an embedded browser engine.
* **Academic Ready**: First-class support for Block Math (\`$$\`) and Inline Math (\`$\`) using MathJax.
* **Universal Export**: Compiles to standard \`.tex\` files for professional academic typesetting.
`;

const MYMD_CASE_STUDY = `# Case Study: Engineering a Language

> **Role**: Language Engineer
> **Stack**: Java, ANTLR4, JavaFX
> **Focus**: Compiler Design & AST Transformations

## 1. The Challenge: Regex vs. Recursion

### The "Parsing" Trap
When I started building a markup editor, my first instinct was to use Regular Expressions.
* **Problem**: Regex parses text linearly. It fails miserably with **Nested Structures**.
* **Example**: How do you parse \`**Bold and *Italic* mixed**\`? Regex struggles to match the correct closing tags.

### The Solution: Context-Free Grammar (CFG)
I decided to treat this as a Compiler Engineering problem. I defined a formal grammar using **ANTLR4** (Another Tool for Language Recognition).
* **Recursive Rules**: In \`MyMD.g4\`, I defined an \`inline\` rule that can recursively contain other \`inline\` elements. This allows for infinite nesting depth, handled naturally by the parser's stack.

---

## 2. The "Bridge": AST Transformation

### Concrete vs. Abstract
ANTLR produces a **Parse Tree** (Concrete Syntax Tree) that exactly matches the grammar rules (including useless tokens like whitespace or brackets).
To make the data useful, I had to build a **Visitor** pattern (\`PandocAstVisitor.java\`) to transform this raw tree into a clean **Abstract Syntax Tree (AST)**.

### Why Pandoc AST?
Instead of inventing my own AST format, I targeted the **Pandoc JSON** standard.
* **Interoperability**: By outputting a standard AST, MyMD essentially became a "Frontend" for the massive Pandoc ecosystem.
* **Result**: I wrote the parser, but I instantly gained support for exporting to PDF, Docx, and LaTeX for free.

---

## 3. The Future: "Web Assembly" Migration

### The JavaFX Limitation
While JavaFX provided a quick way to build a desktop GUI, it locked the application to the user's local machine and required a heavy JDK installation.

### Roadmap: Refactoring to TypeScript
I am currently porting the core logic to the Web:
1.  **Grammar Portability**: ANTLR4 supports generating **TypeScript** parsers from the exact same \`.g4\` grammar file.
2.  **Client-Side Compilation**: Moving the parsing logic from the Java Backend to the Browser.
3.  **Virtual DOM Mapping**: Instead of mapping AST to Pandoc JSON, I will map AST nodes directly to React Components for a sub-millisecond Live Preview.
`;

const MYMD_PARSER = `grammar MyMD;

// ======================= Parser Rules =======================

document
    : block+ EOF
    ;

block
    : horizontalRule          # HorizontalRuleBlock
    | blockquote              # BlockQuoteBlock
    | bulletListBlock         # BulletListRule
    | codeBlock               # CodeBlockRule
    | header                  # HeaderRule
    | blockMath               # BlockMathRule
    | paragraph               # ParagraphBlock
    ;

horizontalRule
    : (DASH DASH DASH+ | STAR STAR STAR+) (SOFT_BREAK | PARAGRAPH_END | EOF)
    ;

blockquote
    : GT SPACE? inline+ (PARAGRAPH_END | EOF)
    ;

header
    : (H1 | H2 | H3 | H4 | H5 | H6) inline+ (PARAGRAPH_END | EOF)
    ;

paragraph
    : inline+ (PARAGRAPH_END | EOF)
    ;

blockMath
    : BLOCK_MATH (PARAGRAPH_END | EOF)?
    ;

bulletListBlock
    : bulletList (PARAGRAPH_END | EOF)?
    ;

codeBlock
    : CODE_BLOCK (PARAGRAPH_END | EOF)?
    ;

bulletList
    : listItem+
    ;

listItem
    : DASH SPACE inline+ (SOFT_BREAK | PARAGRAPH_END)
    ;

// Inline elements.
inline
    : image                   # ImageInline
    | link                    # LinkInline
    | bold                    # BoldInline
    | italic                  # ItalicInline
    | INLINE_MATH             # InlineMathInline
    | INLINE_CODE             # InlineCodeInline
    | citation                # CitationInline
    | lbracket                # LBracketInline
    | rbracket                # RBracketInline
    | bang                    # BangInline
    | gt                      # GtInline
    | lparen                  # LParenInline
    | rparen                  # RParenInline
    | urlText                 # UrlTextInline
    | dash                    # DashInline
    | star                    # StarInline
    | HARD_BREAK              # HardBreakInline
    | SOFT_BREAK              # SoftBreakInline
    | ESCAPED                 # EscapedInline
    | TEXT                    # TextInline
    | SPACE                   # SpaceInline
    ;

citation : CITATION ;
lbracket : LBRACKET ;
rbracket : RBRACKET ;
bold     : '**' inline+ '**' ;
italic   : '*' inline+ '*' ;

bang     : BANG ;
gt       : GT ;
lparen   : LPAREN ;
rparen   : RPAREN ;
urlText  : URL_TEXT ;
dash     : DASH ;
star     : STAR ;

image : BANG LBRACKET inline* RBRACKET LPAREN url RPAREN ;
link  : LBRACKET inline+ RBRACKET LPAREN url RPAREN ;

url : (URL_TEXT | DASH | STAR | TEXT)+ ;

// ======================= Lexer Rules =======================

HARD_BREAK
    : '  ' ('\\r'? '\\n')
    | '\\\\'
    ;
PARAGRAPH_END : ('\\r'? '\\n') ('\\r'? '\\n')+ ;
SOFT_BREAK : '\\r'? '\\n' ;

INLINE_MATH : '$' ~[$]+ '$' ;
BLOCK_MATH: '$$' ( . | '\\r' | '\\n' )*? '$$' ;
INLINE_CODE : '\`' ~[\`\\r\\n]+ '\`' ;
CODE_BLOCK : '\`\`\`' ( . | '\\r' | '\\n' )*? '\`\`\`' ;
CITATION : '[' '@' [a-zA-Z0-9_:-]+ ']' ;

H1 : '#' [ \\t]+ ;
H2 : '##' [ \\t]+ ;
H3 : '###' [ \\t]+ ;
H4 : '####' [ \\t]+ ;
H5 : '#####' [ \\t]+ ;
H6 : '######' [ \\t]+ ;

DASH : '-' ;
STAR : '*' ;
BANG : '!' ;
GT   : '>' ;
LBRACKET : '[' ;
RBRACKET : ']' ;
LPAREN   : '(' ;
RPAREN   : ')' ;

ESCAPED : '\\\\' ~[\\r\\n] ;

// URL
URL_TEXT : [a-zA-Z0-9:/.?#&=_%+]+ ;

TEXT : ~[*\\\\$\`#[\\]!>() \\t\\r\\n-]+ ;

SPACE : [ \\t]+ ;`

const mymd: Project = {
  id: "mymd",
  name: "MyMD_Compiler",
  github: "https://github.com/Yinghao-Guan/MyMD",
  files: [
    { name: "README.md", type: "readme", content: MYMD_README },
    { name: "CASE_STUDY.md", type: "markdown", content: MYMD_CASE_STUDY },
    { name: "Grammar.g4", type: "code", language: "java", content: MYMD_PARSER },
  ],
};

export default mymd;
