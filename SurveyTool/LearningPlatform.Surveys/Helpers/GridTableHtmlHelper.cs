using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.TableLayout;
using System;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace LearningPlatform.Helpers
{
    public static class GridTableHtmlHelper
    {
        public static MvcHtmlString GridTable(this HtmlHelper helper, ITableRenderer model)
        {
            var table = new Table();
            model.RenderGrid(table);
            var sb = new StringBuilder();
            var numberOfHeaderRows = GetNumberOfHeaderRows(model);

            for (int rowIndex = 0; rowIndex < table.RowCount; rowIndex++)
            {
                sb.AppendLine(String.Format("<tr row-index=\"{0}\">", rowIndex));

                for (int columnIndex = 0; columnIndex < table.ColumnCount; columnIndex++)
                {
                    ITableCell tableCell = table.GetTableCell(rowIndex, columnIndex);
                    sb.Append(GetCellHtml(helper, table, table.IsHeaderRow(rowIndex, columnIndex, numberOfHeaderRows), tableCell, rowIndex, columnIndex));
                }
                sb.AppendLine("</tr>");
            }
            return new MvcHtmlString(sb.ToString());
        }

        private static int GetNumberOfHeaderRows(ITableRenderer model)
        {
            return (model is MatrixQuestion) ? 2 : 1;
        }

        private static string GetCellHtml(HtmlHelper helper, Table table, bool isHeaderRow, ITableCell tableCell, int rowIndex, int columnIndex)
        {
            return isHeaderRow
                ? GetHeaderCellHtml(tableCell, table.Transposed, rowIndex, columnIndex)
                : GetQuestionCellHtml(helper, tableCell, rowIndex, columnIndex);
        }

        private static string GetHeaderCellHtml(ITableCell currentItem, bool tranposed, int rowIndex, int columnIndex)
        {
            if (currentItem == null) return "";

            var label = currentItem as LabelCell;
            if (label != null && (rowIndex != 0 || columnIndex != 0))
            {
                var identifyClass = rowIndex == 0 ? "horizontal-header text-center" : "vertical-header";
                if (label.Span != null)
                {
                    string spanType = (tranposed ? "rowspan" : "colspan");
                    return string.Format(@"<th {0}=""{1}"" class=""{3}"" header-id=""{4}"">{2}</th>", spanType, label.Span, label.Description, identifyClass, label.Id);
                }
                return string.Format(@"<th class=""{0}"" header-id=""{1}"">{2}</th>", identifyClass, label.Id, label.Description);
            }
            return "<th></th>";
        }

        private static string GetQuestionCellHtml(HtmlHelper helper, ITableCell currentItem,int rowIndex,int columnIndex)
        {

            if (currentItem is CheckBox)
            {
                var checkBox = currentItem as CheckBox;
                var id = checkBox.Id + "_" + checkBox.Alias;
                return string.Format("<td><label>{0}<span></span></label></td>",
                    helper.CheckBox(checkBox.Id, checkBox.Checked, new {position = checkBox.Position, id = id}));
            }


            if (currentItem is RadioButton)
            {
                var radioButton = currentItem as RadioButton;
                var id = radioButton.Id + "_" + radioButton.Alias;
                return string.Format("<td><label>{0}<span></span></label></td>",
                    radioButton.Checked
                        ? helper.RadioButton(radioButton.Id, radioButton.Alias,
                            new { @checked = "checked", position = radioButton.Position, id = id })
                        : helper.RadioButton(radioButton.Id, radioButton.Alias,
                            new { position = radioButton.Position, id = id }));
            }


            if (currentItem is OpenEndedTextCell)
            {
                var openEndedText = currentItem as OpenEndedTextCell;
                var defaultLongTextListRows = 1;
                var defaultLongTextListCols = 100;
                return string.Format("<td class=\"{0}\">{1}</td>", openEndedText.IsLongText ? "long-text" :"short-text", openEndedText.IsLongText
                    ? helper.TextArea(openEndedText.Id,openEndedText.Answer,openEndedText.Rows ?? defaultLongTextListRows, defaultLongTextListCols, new { position = rowIndex * columnIndex, @class="form-control"})
                    : helper.TextBox(openEndedText.Id, openEndedText.Answer, new { position = rowIndex * columnIndex, @class = "form-control" }));
            }

            if(currentItem is RatingCell)
            {
                var ratingCell = currentItem as RatingCell;
                return string.Format(@"<td class=""form-group ratings"">
                                        <input type=""hidden"" class=""rating"" name=""{0}"" data-rating-number-position=""bottom""
                                            data-stop=""{1}"" data-empty=""{2}"" data-filled=""{3}"" value=""{4}"" />
                                    </td>", ratingCell.Id, ratingCell.Steps, ratingCell.EmptyShapeName, ratingCell.ShapeName, ratingCell.Answer);
            }

            if (currentItem is ListButtonCell)
            {
                var listButtonCell = currentItem as ListButtonCell;
                var listButtonContent = new StringBuilder();

                listButtonContent.AppendLine("<td class='scale-button-section'><div class='horizontal'>");

                var listButtonHeading = new StringBuilder();
                listButtonHeading.AppendLine("<div class='hrow liker-heading'>");

                var listButtonBody = new StringBuilder();
                listButtonBody.AppendLine("<div class='hrow liker render-button'>");

                foreach (var option in listButtonCell.Question.Options)
                {
                    listButtonHeading.AppendLine(string.Format(@"
                        <div class='heading {0}' position='{1}'>
                            <label for='{2}' class='selection-option-title' title-id='{3}'>{4}</label>
                        </div>
                    ", listButtonCell.Question.IsChecked(option) ? "selected" : string.Empty, option.Position, listButtonCell.Id + "_" + option.Alias, listButtonCell.Id + option.Id, option.Text));

                    listButtonBody.AppendLine(string.Format(@"
                        <div class='cell single-selection-option invisible'>
                            <input type='radio' id='{0}' name='{1}' position='{2}' title='{3}' {4} value='{5}' />
                        </div>
                    ", HttpUtility.HtmlDecode(listButtonCell.Id) + "_" + option.Alias,
                        HttpUtility.HtmlDecode(listButtonCell.Id), option.Position, option.Text,
                        listButtonCell.Question.IsChecked(option) ? "checked" : string.Empty,
                        option.Alias));
                }

                listButtonHeading.AppendLine("</div>");
                listButtonBody.AppendLine("</div>");

                listButtonContent.AppendLine(listButtonHeading.ToString());
                listButtonContent.AppendLine(listButtonBody.ToString());

                listButtonContent.AppendLine("</div></td>");

                return listButtonContent.ToString();
            }

            return string.Empty;
        }
    }
}