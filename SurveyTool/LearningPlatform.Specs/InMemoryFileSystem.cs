using System.Collections.Generic;
using System.IO;

namespace LearningPlatform.Specs
{
    public class InMemoryFileSystem
    {
        private Dictionary<string, string> _files = new Dictionary<string, string>();

        public void Save(string fileName, string content)
        {
            _files[fileName] = content;
        }

        public bool FileExists(string fileName)
        {
            return _files.ContainsKey(fileName);
        }

        public string Read(string fileName)
        {
            if (FileExists(fileName))
            {
                return _files[fileName];
            }
            else
            {
                return File.ReadAllText(Path.Combine(@"..\..", fileName));
            }
        }

    }
}
