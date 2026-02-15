grammar Milestone
import "../common/common";

entry Milestone:
  NEWLINE*
  "milestone" showData?="showData"?
  (
    TitleAndAccessibilities 
    | sections+=MilestoneSection
    | NEWLINE
  )*
;

MilestoneSection:
  label=STRING ":" value=NUMBER_MILESTONE EOL
;

terminal FLOAT_MILESTONE returns number: /-?[0-9]+\.[0-9]+(?!\.)/;
terminal INT_MILESTONE returns number: /-?(0|[1-9][0-9]*)(?!\.)/;
terminal NUMBER_MILESTONE returns number: FLOAT_MILESTONE |  INT_MILESTONE;