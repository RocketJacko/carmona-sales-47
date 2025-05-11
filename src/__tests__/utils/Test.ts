export class Test {
  private static instance: Test;

  private constructor() {}

  public static getInstance(): Test {
    if (!Test.instance) {
      Test.instance = new Test();
    }
    return Test.instance;
  }

  public async validarEmail(email: string): Promise<boolean> {
    // Implementación básica de validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 