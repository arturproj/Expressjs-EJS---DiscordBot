# Expressjs--DiscordBot
match manager

A Bot on the Discord app that allows rugby teams to submit matches and others to register. Each match will have a division ranging from 1 to 10 (level), an address (city), a gender (Male, Female or mixed) and a date.
When a match is accepted the organizer receives a message.
Either side can call off a game which warns the other team.

# Get Start:
### 1° step 
npm install
##
### 2° step 
insert in the file ./env:(line 8) -> token DiscordBot : TOKEN

1.  PORT=3001
2.  HOST=localhost
3. 
4.  DB_NAME=rugby_bot
5.  DB_PORT=27017
6.  DB_HOST=localhost
7.        
8.  TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
9. 
10. CL_SUCCESS=2ecc71
11. CL_DANGER=e74c3c
12. CL_WARNING=f39c12
13. CL_INFO=0099ff
14. 
16. EMBED_TITLE_DEFAULT=title
17. EMBED_MSG_DEFAULT={name:"hello",value:""}
18. EMBED_DESCR_DEFAULT=description
19. EMBED_BOT_NAME_DEFAULT=RugbyBot
20. EMBED_BOT_ICON_DEFAULT=https://pbs.twimg.com/profile_images/1161547839765471232/Jhtsculz.jpg
##
# Functionality :
- Create matches
- See all matches created
- See a specific match
- Update the match
- Register for the match
- Invite into the match
- Invitation notifications
- Notification of response to the invitation
- Match cancellation notifications
- Leave the match

##
### Singup on Bot
#### !signup <account> : !signup organizer OR !signup player OR !signup viewer
- organizer : create, update, delete, join, leave, view and invite to matches
- player : join, leave, view and invite to matches
- viewer : join, leave, view and invite to matches
##
### Create matches
#### !create <NAME_MATCH> : !create CUP 2050
##
### See all matches created
#### !match 
##
### See a specific match
#### !match <MATCH_ID (MID)> : !match X0X0X
##
### Update the match
#### !update  <MATCH_ID (MID)> param=(YOUR TEXT)
- update NAME : !update X0X0X name=Example Name
- update DATE : !update X0X0X date=date=01-01-2050 14:20
- update CITY : !update X0X0X city=Paris
- update LEVEL : !update X0X0X level=10
- update GANDER : !update X0X0X gender=mixed
##
### Register for the match
#### !join <MATCH_ID (MID)> : !join X0X0X
##
### Invite into the match
#### !invite <MATCH_ID (MID)> @UserDiscord : !invite X0X0X @Tom @Robin @Mery
- Invitation notifications is automatic
- Notification of response to the invitation is automatic, once invited has responded (accept / decline)
##
### Match cancellation notifications
#### !delete <MATCH_ID (MID)>
- Invitation notifications is automatic to all participants
##
### Leave the match
#### !leave <MATCH_ID (MID)>
- Invitation notifications is automatic to all participants
