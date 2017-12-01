using System.Collections.Generic;

namespace Analyze.Domain.DataSources
{
    public class LanguageString : Dictionary<string, string>
    {
	    public void UpsertDefaultLanguageStringItem(string text)
	    {
		    UpsertLanguageStringItem("en", text);
	    }

	    public void UpsertLanguageStringItem(string languageCode, string text)
	    {
		    Add(languageCode, text);
	    }
	}
}
