using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace LearningPlatform.Domain.UtilServices
{
    public static class EmailService
    {
        public static void SendMail(string toAddress, string subject, string content)
        {
            if (string.IsNullOrWhiteSpace(toAddress)) return;

            var smtp = new SmtpClient();
            var smtpSection = (System.Net.Configuration.SmtpSection)ConfigurationManager.GetSection("system.net/mailSettings/smtp");            

            var message = new MailMessage
            {
                From = new MailAddress(smtpSection.From),
                Subject = subject,
                Body = content,
                IsBodyHtml = true
            };
            message.To.Add(new MailAddress(toAddress));
            smtp.Send(message);
        }

        public static void SendMail(List<string> toAddresses, string subject, string content)
        {
            if (!toAddresses.Any()) return;

            var smtp = new SmtpClient();
            var smtpSection = (System.Net.Configuration.SmtpSection)ConfigurationManager.GetSection("system.net/mailSettings/smtp");
            var message = new MailMessage
            {
                From = new MailAddress(smtpSection.From),
                Subject = subject,
                Body = content,
                IsBodyHtml = true
            };
            foreach (var email in toAddresses)
            {
                message.To.Add(new MailAddress(email));
            }
            smtp.Send(message);
        }

        public static bool ValidateEmail(string email)
        {
            var regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,63})+)$");
            return regex.Match(email).Success;
        }
    }
}
