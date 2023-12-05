# Devlog Entry - [11/18/2023]

## Introducing the team

- Sean is the tools lead, choosing all the tools we will be using, and making sure that everyone is using those same tools, and is up to date on those tools.
- Miles is the design lead, taking the responsibility of game direction and feel. The initial plan is an ascii art game.
- Cameron is Engine Lead, focusing on overall code structure and implementing - features
- Calex will take the role of Production Lead, ensuring that people are organized and know their deadlines and tasks, keeping us on track to meet targets, and turning in assignments

## Tools and materials

With about one paragraph each...

Tell us about what engines, libraries, frameworks, and or platforms you intend to use, and give us a tiny bit of detail about why your team chose those.

- We plan on starting the project using raw Typescript and HTML, and possibly moving to phaser if we need more of an engine library. We were thinking we could make a cool ASCII art game akin to Universal Paper Clips, and to do so we wouldn’t need any heavy duty graphics libraries. We plan to pivot to Phaser if our design direction changes down the road. We chose to work in Typescript because it is a language we have grown accustomed to over the quarter and will be easy to port to Phaser if need be.

Tell us programming languages (e.g. TypeScript) and data languages (e.g. JSON) your team expects to use and why you chose them. Presumably you’ll just be using the languages expected by your previously chosen engine/platform.

- We plan on using TypeScript and JSON, we chose them because we plan on making a very basic game with ASCII art and buttons, and we feel TypeScript suits these ideals for our design very well.

Tell us about which tools you expect to use in the process of authoring your project. You might name the IDE for writing code, the image editor for creating visual assets, or the 3D editor you will use for building your scene. Again, briefly tell us why you made these choices. Maybe one of your teammates feels especially skilled in that tool or it represents something you all want to learn about.

- We plan to use VSCode for all of our coding, and for source control purposes, we plan on using git. We will use both of these because we are extremely familiar with both of them, and we will feel most comfortable using them. For our visual assets, we plan on just using ASCII art, with text and buttons being implemented directly from HTML and TypeScript files. We chose to do this because we like the idea of making an ASCII art game.

## Outlook

Give us a short section on your outlook on the project. You might cover one or more of these topics:

What is your team hoping to accomplish that other teams might not attempt?

- We think it would be fun to integrate an irrigation system, where players can place sprinklers and potentially even route rivers through their farm

What do you anticipate being the hardest or riskiest part of the project?

- Keeping all the data both for garden creation and management sorted and operated on cleanly could end up being a hassle. It doesn’t sound that bad, but sometimes these things can be surprising. The irrigation system mentioned above, although fun, might end up being relatively challenging, as it introduces a number of things to consider.

What are you hoping to learn by approaching the project with the tools and materials you selected above?

- We’re hoping to learn how to make an ASCII game without the use of any engines. We think it would be cool to be able to make a game that’s just pure TypeScript, and either make everything we need ourselves, or repurposing something for a different use to make our game more interesting as a whole.

## How we satisfied the software requirements for F0

For each of the F0 requirements, give a paragraph of explanation for how your game’s implementation satisfies the requirements.
Your team can earn partial credit for covering only a subset of the F0 requirements at this stage. (It is much better to satisfy the requirements in a sloppy way right now than lock in your partial credit.)

- [F0.a] You control a character moving on a 2D grid.
  We first implemented a grid that is 5 by 5 and implemented a tile system to determine each cell in the grid. We then made a character that is represented by the four symbols "<", ">", "^", "v". The character stores its orientation and to move to another orientation you move in that direction, which will not move the character but first turn the character. To move forward the character will first check that the tile is able to be moved on (I.E. no plants on that tile/not at the edge of the grid), then it will update its position in the grid so on the next update call the character is in the new position.
- [F0.b] You advance time in the turn-based simulation manually.
  Our current imlementation of time utilizes an update function which is called everytime we want to update the cells. We currently update the game grid every time the character moves, as well as an external button that passes the time. When time passes, plants will grow to further plant stages, the water level changes for each individual cells, and the sun level changes for the entire grid. The plants will grow a certain amount based on what plant type is growing, so some plants will grow faster than others.
- [F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them.
  The character currently looks to the cell directly in front them, and all interaction happens on that cell. Each cell has a property "plant", which is initialized to nothing at first. The player can currently press a button to plant either a Carrot or Potato, which will update the cell's plant property so the cell knows what plant is within it. The plant will be initialized to it's starting icon, and as time passes the plant's icon will change to a different icon. Whe the plant is ready to harvest it will change it's icon to a unique icon, from the rest of the growth stages. The player can then go up to the plant and click a harvest button which removes the plant from the cell and adds a value to the players inventory.
- [F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
  Each cell in the grid has a unique water level property. When time passes a random amount of water is added to each cell. We currently don't have any implementation to remove water from the cells. The sun is slightly different from the water, as it is not cell dependant and is instead set for the entire grid where it updates each time passes. There are only 3 sunlight levels and the sun light level is randomly chosen each update.
- [F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).
  We made a plant class which has a property of it's type, a list of icons to use at each growth level, the max growth level, and a slew of other properties. We then made a function that takes in a string for the plant type and makes a new instance of the plant class with all the fields in the constructor premade. This all you have to do is call make plant with the string and you don't have to worry about the specific growth stages icons, or its max growth level. The plant's icons will change based on it's current growth level. The max growth level is divided by the number of icons in the icon list to get the growth amount. The growth amount is then used to index the list of icons to display. This way you can change the number of levels the plant needs to grow and the icons will change at equal intervals.
- [F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
  The spatial rules we decided to implement are that a plant needs a certain amount of water and sun to be planted and to grow. The plant also needs to have less than 4 neighbors in the cardinal directions. If any of these conditions are not met the plant will not grow on the next update iteration.
- [F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).
  The player's current goal is to aquire $100. Each time you harvest a plant you will be rewarded a certain amount of money based on what plant you are growing, and harvesting. Each time we update the game we check if the player has more than or equal to $100 dollars, and display a pop up if the player reached that goal.

## Reflection on F0

Looking back on how you achieved the F0 requirements, how has your team’s plan changed? Did you reconsider any of the choices you previously described for Tools and Materials or your Roles? It would be very suspicious if you didn’t need to change anything. There’s learning value in you documenting how your team’s thinking has changed over time.

- We initially wanted to have it be purly text based but we decided to have the color of the tile represent the water level. Our roles, have generally been upheld although we all came together to program most of the starter code. We each took a topic and began coding our implementation of the topic leaving space for integration later. This turned out to be confusing and we spent a good deal of time reading through how the others made their section and figuring out how to bind them all together. Ultimatly we hadd to make some shortcuts to get the implementation done on time, however we plan to refactor all our code before F1. In the future we plan to stay in pure HTML and Typescript and will have a stronger foundation to build upon so we won't get as confused. We are trying to think of better ways to divde work so we arn't building systems that don't work together.

## How we satisfied the software requirements for F1

### F0 Requirements

- [F0.a] You control a character moving on a 2D grid.
  - Same as previous, but grid changed to use ArrayBuffer in 1D format.
- [F0.b] You advance time in the turn-based simulation manually.
  - Same as previous.
- [F0.c] You can reap (gather) or sow (plant) plants on the grid when your character is near them.
  Same as previous, but you can use spacebar to harvest plants.
- [F0.d] Grid cells have sun and water levels. The incoming sun and water for each cell is somehow randomly generated each turn. Sun energy cannot be stored in a cell (it is used immediately or lost) while water moisture can be slowly accumulated over several turns.
  Each cell in the grid has a unique water level property.
  - Same as previous.
- [F0.e] Each plant on the grid has a type (e.g. one of 3 species) and a growth level (e.g. “level 1”, “level 2”, “level 3”).
  - Same as previous.
- [F0.f] Simple spatial rules govern plant growth based on sun, water, and nearby plants (growth is unlocked by satisfying conditions).
  - Same as previous.
- [F0.g] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).
  - Same as previous.

### F1 Requirements

- [F1.a] A play scenario is completed when some condition is satisfied (e.g. at least X plants at growth level Y or above).
  - PH
- [F1.b] The player must be able to undo every major choice (all the way back to the start of play), even from a saved game. They should be able to redo (undo of undo operations) multiple times.
  - PH
- [F1.c] The player must be able to manually save their progress in the game in a way that allows them to load that save and continue play another day. The player must be able to manage multiple save files (allowing save scumming).
  - PH
- [F1.d] The game must implement an implicit auto-save system to support recovery from unexpected quits. (For example, when the game is launched, if an auto-save entry is present, the game might ask the player "do you want to continue where you left off?" The auto-save entry might or might not be visible among the list of manual save entries available for the player to load as part of F1.c.)
  - PH

## Reflection on F1
