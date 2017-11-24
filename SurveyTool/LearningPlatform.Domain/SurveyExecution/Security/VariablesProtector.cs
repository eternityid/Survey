using System;
using System.Text;
using System.Web.Security;
using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyExecution.Security
{
    public static class VariablesProtector
    {
        public static string Protect(ProtectedVariables protectedVariables, string purpose="form")
        {
            string serializeObject = JsonConvert.SerializeObject(protectedVariables, Formatting.None, new JsonSerializerSettings{NullValueHandling = NullValueHandling.Ignore});
            byte[] unprotectedBytes = Encoding.UTF8.GetBytes(
                serializeObject);
            byte[] protectedBytes = MachineKey.Protect(unprotectedBytes, purpose);
            string protectedText = Convert.ToBase64String(protectedBytes);
            return protectedText;
        }

        public static ProtectedVariables Unprotect(string protectedText, string purpose="form")
        {
            if (protectedText == null) return new ProtectedVariables();
            byte[] unprotectedBytes = MachineKey.Unprotect(Convert.FromBase64String(protectedText), purpose);
            if (unprotectedBytes == null) throw new InvalidOperationException("Unexpected null returned");
            string unprotectedText = Encoding.UTF8.GetString(unprotectedBytes);
            return JsonConvert.DeserializeObject<ProtectedVariables>(unprotectedText);
        }
    }
}