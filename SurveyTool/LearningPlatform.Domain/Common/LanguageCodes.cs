using System.Collections.Generic;

namespace LearningPlatform.Domain.Common
{
    public static class LanguageCodes
    {
        private static readonly Dictionary<string, string> NativeNames = new Dictionary<string, string>
        {
            {"ab", "аҧсуа бызшәа, аҧсшәа"}, //Abkhaz
            {"aa", "Afaraf"}, //Afar
            {"af", "Afrikaans"}, //Afrikaans
            {"ak", "Akan"}, //Akan
            {"sq", "Shqip"}, //Albanian
            {"am", "አማርኛ"}, //Amharic
            {"ar", "العربية"}, //Arabic
            {"an", "aragonés"}, //Aragonese
            {"hy", "Հայերեն"}, //Armenian
            {"as", "অসমীয়া"}, //Assamese
            {"av", "авар мацӀ, магӀарул мацӀ"}, //Avaric
            {"ae", "avesta"}, //Avestan
            {"ay", "aymar aru"}, //Aymara
            {"az", "azərbaycan dili"}, //Azerbaijani
            {"bm", "bamanankan"}, //Bambara
            {"ba", "башҡорт теле"}, //Bashkir
            {"eu", "euskara, euskera"}, //Basque
            {"be", "беларуская мова"}, //Belarusian
            {"bn", "বাংলা"}, //Bengali, Bangla
            {"bh", "भोजपुरी"}, //Bihari
            {"bi", "Bislama"}, //Bislama
            {"bs", "bosanski jezik"}, //Bosnian
            {"br", "brezhoneg"}, //Breton
            {"bg", "български език"}, //Bulgarian
            {"my", "ဗမာစာ"}, //Burmese
            {"ca", "català"}, //Catalan
            {"ch", "Chamoru"}, //Chamorro
            {"ce", "нохчийн мотт"}, //Chechen
            {"ny", "chiCheŵa, chinyanja"}, //Chichewa, Chewa, Nyanja
            {"zh", "中文 (Zhōngwén), 汉语, 漢語"}, //Chinese
            {"cv", "чӑваш чӗлхи"}, //Chuvash
            {"kw", "Kernewek"}, //Cornish
            {"co", "corsu, lingua corsa"}, //Corsican
            {"cr", "ᓀᐦᐃᔭᐍᐏᐣ"}, //Cree
            {"hr", "hrvatski jezik"}, //Croatian
            {"cs", "čeština, český jazyk"}, //Czech
            {"da", "dansk"}, //Danish
            {"dv", "ދިވެހި"}, //Divehi, Dhivehi, Maldivian
            {"nl", "Nederlands, Vlaams"}, //Dutch
            {"dz", "རྫོང་ཁ"}, //Dzongkha
            {"en", "English"}, //English
            {"eo", "Esperanto"}, //Esperanto
            {"et", "eesti, eesti keel"}, //Estonian
            {"ee", "Eʋegbe"}, //Ewe
            {"fo", "føroyskt"}, //Faroese
            {"fj", "vosa Vakaviti"}, //Fijian
            {"fi", "suomi, suomen kieli"}, //Finnish
            {"fr", "français, langue française"}, //French
            {"ff", "Fulfulde, Pulaar, Pular"}, //Fula, Fulah, Pulaar, Pular
            {"gl", "galego"}, //Galician
            {"ka", "ქართული"}, //Georgian
            {"de", "Deutsch"}, //German
            {"el", "ελληνικά"}, //Greek (modern)
            {"gn", "Avañe'ẽ"}, //Guaraní
            {"gu", "ગુજરાતી"}, //Gujarati
            {"ht", "Kreyòl ayisyen"}, //Haitian, Haitian Creole
            {"ha", "(Hausa) هَوُسَ"}, //Hausa
            {"he", "עברית"}, //Hebrew (modern)
            {"hz", "Otjiherero"}, //Herero
            {"hi", "हिन्दी, हिंदी"}, //Hindi
            {"ho", "Hiri Motu"}, //Hiri Motu
            {"hu", "magyar"}, //Hungarian
            {"ia", "Interlingua"}, //Interlingua
            {"id", "Bahasa Indonesia"}, //Indonesian
            {"ie", "Originally called Occidental; then Interlingue after WWII"}, //Interlingue
            {"ga", "Gaeilge"}, //Irish
            {"ig", "Asụsụ Igbo"}, //Igbo
            {"ik", "Iñupiaq, Iñupiatun"}, //Inupiaq
            {"io", "Ido"}, //Ido
            {"is", "Íslenska"}, //Icelandic
            {"it", "italiano"}, //Italian
            {"iu", "ᐃᓄᒃᑎᑐᑦ"}, //Inuktitut
            {"ja", "日本語 (にほんご)"}, //Japanese
            {"jv", "ꦧꦱꦗꦮ, Basa Jawa"}, //Javanese
            {"kl", "kalaallisut, kalaallit oqaasii"}, //Kalaallisut, Greenlandic
            {"kn", "ಕನ್ನಡ"}, //Kannada
            {"kr", "Kanuri"}, //Kanuri
            {"ks", "कश्मीरी, كشميري‎"}, //Kashmiri
            {"kk", "қазақ тілі"}, //Kazakh
            {"km", "ខ្មែរ, ខេមរភាសា, ភាសាខ្មែរ"}, //Khmer
            {"ki", "Gĩkũyũ"}, //Kikuyu, Gikuyu
            {"rw", "Ikinyarwanda"}, //Kinyarwanda
            {"ky", "Кыргызча, Кыргыз тили"}, //Kyrgyz
            {"kv", "коми кыв"}, //Komi
            {"kg", "Kikongo"}, //Kongo
            {"ko", "한국어, 조선어"}, //Korean
            {"ku", "Kurdî, كوردی‎"}, //Kurdish
            {"kj", "Kuanyama"}, //Kwanyama, Kuanyama
            {"la", "latine, lingua latina"}, //Latin
            {"lb", "Lëtzebuergesch"}, //Luxembourgish, Letzeburgesch
            {"lg", "Luganda"}, //Ganda
            {"li", "Limburgs"}, //Limburgish, Limburgan, Limburger
            {"ln", "Lingála"}, //Lingala
            {"lo", "ພາສາລາວ"}, //Lao
            {"lt", "lietuvių kalba"}, //Lithuanian
            {"lu", "Tshiluba"}, //Luba-Katanga
            {"lv", "latviešu valoda"}, //Latvian
            {"gv", "Gaelg, Gailck"}, //Manx
            {"mk", "македонски јазик"}, //Macedonian
            {"mg", "fiteny malagasy"}, //Malagasy
            {"ms", "bahasa Melayu, بهاس ملايو‎"}, //Malay
            {"ml", "മലയാളം"}, //Malayalam
            {"mt", "Malti"}, //Maltese
            {"mi", "te reo Māori"}, //Māori
            {"mr", "मराठी"}, //Marathi (Marāṭhī)
            {"mh", "Kajin M̧ajeļ"}, //Marshallese
            {"mn", "Монгол хэл"}, //Mongolian
            {"na", "Dorerin Naoero"}, //Nauruan
            {"nv", "Diné bizaad"}, //Navajo, Navaho
            {"nd", "isiNdebele"}, //Northern Ndebele
            {"ne", "नेपाली"}, //Nepali
            {"ng", "Owambo"}, //Ndonga
            {"nb", "Norsk bokmål"}, //Norwegian Bokmål
            {"nn", "Norsk nynorsk"}, //Norwegian Nynorsk
            {"no", "Norsk"}, //Norwegian
            {"ii", "ꆈꌠ꒿ Nuosuhxop"}, //Nuosu
            {"nr", "isiNdebele"}, //Southern Ndebele
            {"oc", "occitan, lenga d'òc"}, //Occitan
            {"oj", "ᐊᓂᔑᓈᐯᒧᐎᓐ"}, //Ojibwe, Ojibwa
            {"cu", "ѩзыкъ словѣньскъ"}, //Old Church Slavonic, Church Slavonic, Old Bulgarian
            {"om", "Afaan Oromoo"}, //Oromo
            {"or", "ଓଡ଼ିଆ"}, //Oriya
            {"os", "ирон æвзаг"}, //Ossetian, Ossetic
            {"pa", "ਪੰਜਾਬੀ"}, //Eastern Punjabi, Eastern Panjabi
            {"pi", "पाऴि"}, //Pāli
            {"fa", "فارسی"}, //Persian (Farsi)
            {"pl", "język polski, polszczyzna"}, //Polish
            {"ps", "پښتو"}, //Pashto, Pushto
            {"pt", "Português"}, //Portuguese
            {"qu", "Runa Simi, Kichwa"}, //Quechua
            {"rm", "rumantsch grischun"}, //Romansh
            {"rn", "Ikirundi"}, //Kirundi
            {"ro", "Română"}, //Romanian
            {"ru", "Русский"}, //Russian
            {"sa", "संस्कृतम्"}, //Sanskrit (Saṁskṛta)
            {"sc", "sardu"}, //Sardinian
            {"sd", "सिन्धी, سنڌي، سندھی‎"}, //Sindhi
            {"se", "Davvisámegiella"}, //Northern Sami
            {"sm", "gagana fa'a Samoa"}, //Samoan
            {"sg", "yângâ tî sängö"}, //Sango
            {"sr", "српски језик"}, //Serbian
            {"gd", "Gàidhlig"}, //Scottish Gaelic, Gaelic
            {"sn", "chiShona"}, //Shona
            {"si", "සිංහල"}, //Sinhalese, Sinhala
            {"sk", "slovenčina, slovenský jazyk"}, //Slovak
            {"sl", "slovenski jezik, slovenščina"}, //Slovene
            {"so", "Soomaaliga, af Soomaali"}, //Somali
            {"st", "Sesotho"}, //Southern Sotho
            {"es", "español"}, //Spanish
            {"su", "Basa Sunda"}, //Sundanese
            {"sw", "Kiswahili"}, //Swahili
            {"ss", "SiSwati"}, //Swati
            {"sv", "svenska"}, //Swedish
            {"ta", "தமிழ்"}, //Tamil
            {"te", "తెలుగు"}, //Telugu
            {"tg", "тоҷикӣ, toçikī, تاجیکی‎"}, //Tajik
            {"th", "ไทย"}, //Thai
            {"ti", "ትግርኛ"}, //Tigrinya
            {"bo", "བོད་ཡིག"}, //Tibetan Standard, Tibetan, Central
            {"tk", "Türkmen, Түркмен"}, //Turkmen
            {"tl", "Wikang Tagalog"}, //Tagalog
            {"tn", "Setswana"}, //Tswana
            {"to", "faka Tonga"}, //Tonga (Tonga Islands)
            {"tr", "Türkçe"}, //Turkish
            {"ts", "Xitsonga"}, //Tsonga
            {"tt", "татар теле, tatar tele"}, //Tatar
            {"tw", "Twi"}, //Twi
            {"ty", "Reo Tahiti"}, //Tahitian
            {"ug", "ئۇيغۇرچە‎, Uyghurche"}, //Uyghur
            {"uk", "Українська"}, //Ukrainian
            {"ur", "اردو"}, //Urdu
            {"uz", "Oʻzbek, Ўзбек, أۇزبېك‎"}, //Uzbek
            {"ve", "Tshivenḓa"}, //Venda
            {"vi", "Tiếng Việt"}, //Vietnamese
            {"vo", "Volapük"}, //Volapük
            {"wa", "walon"}, //Walloon
            {"cy", "Cymraeg"}, //Welsh
            {"wo", "Wollof"}, //Wolof
            {"fy", "Frysk"}, //Western Frisian
            {"xh", "isiXhosa"}, //Xhosa
            {"yi", "ייִדיש"}, //Yiddish
            {"yo", "Yorùbá"}, //Yoruba
            {"za", "Saɯ cueŋƅ, Saw cuengh"}, //Zhuang, Chuang
            {"zu", "isiZulu"}, //Zulu
        };

        public static string GetNativeLanguage(string languageCode)
        {
            return NativeNames[languageCode];
        }
    }
}