# Phaser Roguelike

To run the project do this: 
In terminal run command npm i inside the roguelike folder to load required files the project uses (once at start).
Npm command naturally requires node package manager, which you can get by installing node from https://nodejs.org/en.

After that if you run the command npm run dev the game should show up playable in localhost with the provided link 
the terminal gives (which goes something like this http://localhost:8080/).

The game source code is in src folder.

## So what am I looking at?

Scene progressions goes like this: Boot -> Preloader (loads assets for all scenes) -> PressAnyKey -> MainMenu -> ChracterCreation -> Game (& GameplayUi, & LevelRenderer). 

The file that implements Character Creation scene might be the most interesting one of the UI scenes though scenes/MainMenu might be a good bite sized starting point for those still getting used to Phaser. I hope my general coding style comes through in all scripts even if they deal with just UI. I'm equally proud of mundane code as well as more glamorous code. It's the style and attitude that matters.

I did some gameplay code during 7 Day Roguelike Challenge. These files are now included with the repo and the gameplay advances after character creation. Added features include: map, changing dungeon levels (though not procedurally generated), movement, player that can attack monsters, log, spawning monsters. These are the foundation for later gameplay though some interesting questions arise like what's the max map size going to be and what kind of UI needs be shown.