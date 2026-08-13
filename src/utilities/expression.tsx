type TokenType = "num" | "op" | "lparen" | "rparen" | "ident" | "comma";

interface Token {
  type: TokenType;
  value: string;
}

const FUNCTIONS = new Set([
  "sin",
  "cos",
  "tan",
  "sqrt",
  "log",
  "ln",
  "abs",
  "exp",
]);

const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.replace(/\s+/g, "");

  while (i < s.length) {
    const c = s[i];

    if (/[0-9.]/.test(c)) {
      let num = c;
      i++;
      while (i < s.length && /[0-9.]/.test(s[i])) {
        num += s[i];
        i++;
      }
      tokens.push({ type: "num", value: num });
      continue;
    }

    if (/[a-zA-Z]/.test(c)) {
      let ident = c;
      i++;
      while (i < s.length && /[a-zA-Z]/.test(s[i])) {
        ident += s[i];
        i++;
      }
      tokens.push({ type: "ident", value: ident.toLowerCase() });
      continue;
    }

    if ("+-*/^%".includes(c)) {
      tokens.push({ type: "op", value: c });
      i++;
      continue;
    }

    if (c === "(") {
      tokens.push({ type: "lparen", value: c });
      i++;
      continue;
    }

    if (c === ")") {
      tokens.push({ type: "rparen", value: c });
      i++;
      continue;
    }

    if (c === ",") {
      tokens.push({ type: "comma", value: c });
      i++;
      continue;
    }

    throw new Error(`Unexpected character: ${c}`);
  }

  return tokens;
}

class Parser {
  private tokens: Token[];
  private pos = 0;
  private variables: Record<string, number>;

  constructor(tokens: Token[], variables: Record<string, number>) {
    this.tokens = tokens;
    this.variables = variables;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token | undefined {
    return this.tokens[this.pos++];
  }

  parse(): number {
    const result = this.parseExpression();
    if (this.pos < this.tokens.length) {
      throw new Error("Unexpected trailing input");
    }
    return result;
  }

  private parseExpression(): number {
    let value = this.parseTerm();
    while (this.peek()?.type === "op" && (this.peek()!.value === "+" || this.peek()!.value === "-")) {
      const op = this.next()!.value;
      const rhs = this.parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  private parseTerm(): number {
    let value = this.parsePower();
    while (
      this.peek()?.type === "op" &&
      (this.peek()!.value === "*" || this.peek()!.value === "/" || this.peek()!.value === "%")
    ) {
      const op = this.next()!.value;
      const rhs = this.parsePower();
      if (op === "*") value = value * rhs;
      else if (op === "/") value = value / rhs;
      else value = value % rhs;
    }
    return value;
  }

  private parsePower(): number {
    const base = this.parseUnary();
    if (this.peek()?.type === "op" && this.peek()!.value === "^") {
      this.next();
      const exponent = this.parsePower();
      return Math.pow(base, exponent);
    }
    return base;
  }

  private parseUnary(): number {
    if (this.peek()?.type === "op" && (this.peek()!.value === "-" || this.peek()!.value === "+")) {
      const op = this.next()!.value;
      const value = this.parseUnary();
      return op === "-" ? -value : value;
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    const token = this.peek();
    if (!token) throw new Error("Unexpected end of expression");

    if (token.type === "num") {
      this.next();
      return parseFloat(token.value);
    }

    if (token.type === "lparen") {
      this.next();
      const value = this.parseExpression();
      if (this.peek()?.type !== "rparen") throw new Error("Expected closing parenthesis");
      this.next();
      return value;
    }

    if (token.type === "ident") {
      this.next();
      const name = token.value;

      if (FUNCTIONS.has(name)) {
        if (this.peek()?.type !== "lparen") throw new Error(`Expected '(' after ${name}`);
        this.next();
        const arg = this.parseExpression();
        if (this.peek()?.type !== "rparen") throw new Error("Expected closing parenthesis");
        this.next();
        return this.applyFunction(name, arg);
      }

      if (name in this.variables) return this.variables[name];
      if (name in CONSTANTS) return CONSTANTS[name];

      throw new Error(`Unknown identifier: ${name}`);
    }

    throw new Error("Unexpected token");
  }

  private applyFunction(name: string, arg: number): number {
    switch (name) {
      case "sin":
        return Math.sin(arg);
      case "cos":
        return Math.cos(arg);
      case "tan":
        return Math.tan(arg);
      case "sqrt":
        return Math.sqrt(arg);
      case "log":
        return Math.log10(arg);
      case "ln":
        return Math.log(arg);
      case "abs":
        return Math.abs(arg);
      case "exp":
        return Math.exp(arg);
      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }
}


export function evaluateExpression(expr: string, variables: Record<string, number> = {}): number {
  if (!expr || !expr.trim()) return NaN;
  const tokens = tokenize(expr);
  const parser = new Parser(tokens, variables);
  return parser.parse();
}