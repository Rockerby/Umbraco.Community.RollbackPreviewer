# Umbraco Rollback Previewer 

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.RollbackPreviewer?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.RollbackPreviewer/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.RollbackPreviewer?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.RollbackPreviewer)
[![GitHub license](https://img.shields.io/github/license/Rockerby/Umbraco.Community.RollbackPreviewer?color=8AB803)](../LICENSE)

Enhance Umbraco's rollback functionality with visual rollback previews. This extension builds ontop of the existing Umbraco Rollback modal and allows for the JSON diff to be viewed as well as the visual diff.

<img alt="Visual difference" src="https://github.com/Rockerby/Umbraco.Community.RollbackPreviewer/blob/develop/docs/screenshots/visual_diff.png"> 
<img alt="JSON difference" src="https://github.com/Rockerby/Umbraco.Community.RollbackPreviewer/blob/develop/docs/screenshots/json_diff.png">

## Installation

Add the package to an existing Umbraco website from nuget. From v1.0.0 you can install the same package on Umbraco 13+.

`dotnet add package Umbraco.Community.RollbackPreviewer`

Once the package installed it will automatically replace the current Rollback modal within Umbraco.

> [!IMPORTANT]  
> The Rollback Previewer uses iFrames to function so you may need to adjust X-Frame-Options to see the preview

## Running locally (v15)

Clone the repository.  
  
Head into the `src\Umbraco.Community.RollbackPreviewer\Client` and run the following to start the dev server:  
`npm ci`  
`npm run dev`  

Open the sln file and run the Umbraco project, or head to `src\Umbraco.Community.RollbackPreviewer.TestSite` and run `dotnet run`, (uSync should automatically import, if not, go import everything) and head to the home node within the CMS. Make a change and go to the Info app and click the Rollback button to see the visual diff.  
  
Check out the Services.RollBackContentFinder for information on the fetching and displaying of the rollbacked version.  
  
Login: admin@example.com / 1234567890  

## Running locally (v13)

Clone the repository.  
  
Head into the `src\Umbraco.Community.RollbackPreviewer\wwwroot\App_Plugins\UmbracoCommunityRollbackPreviewer.v13` and edit the files as you like. They are pushed through to the site via RCL and there are no npm tasks to run.

Open the sln file and run the Umbraco project, or head to `src\Umbraco.Community.RollbackPreviewer.TestSite.v13` and run `dotnet run`, (uSync should automatically import, if not, go import everything) and head to the home node within the CMS. Make a change and go to the Info app and click the Rollback button to see the visual diff.  
  
Check out the Services.RollBackContentFinder for information on the fetching and displaying of the rollbacked version.  
  
Login: admin@example.com / 1234567890  
  
## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).  
  
Check out the project for release / updates [here](https://github.com/users/Rockerby/projects/2/views/1)  

## Acknowledgments

Mike Masey came up with the idea  
Matt Brailsford provided [the basis for converting internal models](https://gist.github.com/mattbrailsford/5f9638d357df59aeac1be8588a06c31e)  
Lotte Pitcher for her amazing [Opinionated Starter Kit](https://github.com/LottePitcher/opinionated-package-starter)  
Rollback icon created by maswan - [Flaticon](https://www.flaticon.com/free-icons/rollback)
