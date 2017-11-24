namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class CheckedItem : ITableCell
    {
        public string Id { get; set; }
        public string Alias { get; set; }
        public bool Checked { get; set; }
        public int Position { get; set; }

        public override bool Equals(object obj)
        {
            var checkedItem = obj as CheckedItem;
            if (checkedItem == null) return false;

            return obj.GetType() == GetType()
                   && Id == checkedItem.Id
                   && Alias == checkedItem.Alias
                   && Checked == checkedItem.Checked;
        }

        public override int GetHashCode()
        {
            int hash = 0;
            if (Id != null) hash |= Id.GetHashCode();
            hash |= Alias.GetHashCode();
            hash |= Checked.GetHashCode();
            return hash;
        }

    }
}