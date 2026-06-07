# YouChat Client Update Audit

Generated at: 2026-06-07T09:31:19.1886618Z

Client root: C:\Program Files\youchat-desktop

## Key Files

| File | Exists | Bytes | SHA256 |
|---|---:|---:|---|
| iconfont.css | True | 1789 | e98ef606544c5598355b685bde5efbce885df43c44f553dc1aef10ff1c262486 |
| iconfont.woff2 | True | 6648 | 4d344f437ba64820f2a9d1005fcb83752031c03a4773f9eb80eb1732fdd06025 |
| braft css | True | 414290 | d39af6bf500de9fff0e29e8d76e256747c1586a7bd3b35d07077d3567031e979 |
| emoji sprite | True | 616827 | a79df3f4f8cc58ad11a3b93ebdc8d08b053fa6efd1e511552a215c493cea6594 |
| YouChatService.xml | True | 210184 | 5d9f29e710643a29145d99b4dab32b655fe2585c9755756fd7354d54ea88e769 |

## Endpoint Candidates

Found 56 endpoint-like strings. First 80:

- /a/b
- /a/i
- /Account/AddPerformanceSetting
- /Account/GetAccountPerforList
- /Account/GetPerformanceSetting
- /ChatContent/GetChatContentList
- /ChatContent/GetList
- /ChatContent/GetNotReplyConversationList
- /ChatContent/UpdateNotReplyConversationList
- /Contact/GetContactList
- /conversation/conversationFx
- /Conversation/GetConversationList
- /conversation/noConversation
- /login/loginOut
- /performance/set
- /Robot/GetList
- /sensitiveWords/set
- /Senstive/AddGroup
- /Senstive/AddSensitiveObjectList
- /Senstive/AddWord
- /Senstive/DeleteGroup
- /Senstive/DeleteSensitiveObjectList
- /Senstive/DeleteWord
- /Senstive/GetAccountList
- /Senstive/GetContactList
- /Senstive/GetGroup
- /Senstive/GetRecord
- /Senstive/GetSensitiveObjectList
- /Senstive/GetWordPage
- /Senstive/UpdateGroup
- /Senstive/UpdateRecord
- /Senstive/UpdateWord
- /Summary/ConversationDetailsSummary
- /Summary/ConversationSummary
- /Summary/ConversationTendSummary
- /Summary/DaylySumary
- /Summary/EfficiencyExport
- /Summary/EfficiencySummary
- /Summary/GetEfficiencyByAccSummary
- /Summary/Login
- /Summary/MsgTypeSumary
- /Summary/PerformanceExport
- /Summary/PerformanceSummary
- /Summary/ResponseTimeExport
- /Summary/ResponseTimeSummary
- /Summary/SatisfactionExport
- /Summary/SatisfactionSummary
- /Summary/ScoreSumary
- /Summary/ScoreTypeSumary
- /Summary/TimeoutExport
- /Summary/TimeoutSummary
- /Summary/WorkloadSummary
- /tencentCos/uploadImage
- /Users/Edit
- /usr/local
- /y/x

## Review Checklist

1. If iconfont.css or the Braft CSS hash changed, re-check glyph mappings in public/styles.css.
2. If the emoji sprite hash changed, re-check the red packet sprite position.
3. If YouChatService.xml or endpoint candidates changed, compare logs/api-capture.ndjson, HAR files, and frontend API params.
4. After review, run tools/export-devkit-patch.ps1 to export a fresh portable patch.
