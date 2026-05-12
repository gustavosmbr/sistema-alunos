namespace AlunosApi.Domain.Utils;

public static class CpfValidator
{
    public static bool Validar(string cpf)
    {
        if (string.IsNullOrWhiteSpace(cpf)) return false;

        // Remove pontuao
        cpf = cpf.Replace(".", "").Replace("-", "");

        if (cpf.Length != 11) return false;

        // Verifica sequncias invlidas conhecidas
        switch (cpf)
        {
            case "00000000000": case "11111111111": case "22222222222":
            case "33333333333": case "44444444444": case "55555555555":
            case "66666666666": case "77777777777": case "88888888888":
            case "99999999999": return false;
        }

        int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
        int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
        
        string tempCpf = cpf.Substring(0, 9);
        int soma = 0;

        for (int i = 0; i < 9; i++)
            soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];

        int resto = soma % 11;
        resto = resto < 2 ? 0 : 11 - resto;

        string digito = resto.ToString();
        tempCpf = tempCpf + digito;
        soma = 0;

        for (int i = 0; i < 10; i++)
            soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];

        resto = soma % 11;
        resto = resto < 2 ? 0 : 11 - resto;

        digito = digito + resto.ToString();

        return cpf.EndsWith(digito);
    }
}
