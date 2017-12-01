using System;

namespace Analyze.Domain.Exceptions
{
	public class AnalyzeDomainException : Exception
	{
		public AnalyzeDomainException()
		{ }

		public AnalyzeDomainException(string message)
			: base(message)
		{ }

		public AnalyzeDomainException(string message, Exception innerException)
			: base(message, innerException)
		{ }
	}
}
