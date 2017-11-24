namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class RatingCell : ITableCell
    {
        public RatingCell(string id, int steps, string answer = null, string shapeName = null)
        {
            Id = id;
            Answer = answer;
            Steps = steps;
            ShapeName = shapeName;
        }

        public string Id { get; set; }
        public string Answer { get; set; }
        public string ShapeName { get; set; }
        public int Steps { get; set; }

        public string EmptyShapeName {
            get {
                return string.Format("{0}-empty", ShapeName);
            }
        }

        public override bool Equals(object obj)
        {
            var checkedItem = obj as RatingCell;
            if (checkedItem == null) return false;

            return obj.GetType() == GetType()
                   && Id == checkedItem.Id;
        }

        public override int GetHashCode()
        {
            int hash = 0;
            if (Id != null) hash |= Id.GetHashCode();
            return hash;
        }
    }
}
