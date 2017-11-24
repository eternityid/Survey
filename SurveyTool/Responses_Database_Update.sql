USE [Responses]
GO
ALTER TABLE [dbo].[Respondents] ADD [EmailAddress] [varchar](255) NULL
ALTER TABLE [dbo].[Respondents] ADD [NumberSent] [int] NOT NULL DEFAULT(0)
ALTER TABLE [dbo].[Respondents] ADD [LastTimeSent] [datetime] NULL
GO


