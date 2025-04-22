# Umbraco Rollback Previewer 

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.RollbackPreviewer?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.RollbackPreviewer/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.RollbackPreviewer?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.RollbackPreviewer)
[![GitHub license](https://img.shields.io/github/license/Rockerby/Umbraco.Community.RollbackPreviewer?color=8AB803)](../LICENSE)

Enhance Umbraco's rollback functionality with visual rollback previews. This extension builds ontop of the existing Umbraco Rollback modal and allows for the JSON diff to be viewed as well as the visual diff.

<img alt="Visual difference" src="https://github.com/Rockerby/Umbraco.Community.RollbackPreviewer/blob/develop/docs/screenshots/visual_diff.png">
<img alt="JSON difference" src="https://github.com/Rockerby/Umbraco.Community.RollbackPreviewer/blob/develop/docs/screenshots/json_diff.png">

## Installation

Add the package to an existing Umbraco website (v15+) from nuget:

`dotnet add package Umbraco.Community.RollbackPreviewer`

Once the package installed it will automatically replace the current Rollback modal within Umbraco.

## Running locally

Clone the repository and start the sln file. Run the Umbraco project (uSync should automatically import, if not, go import everything) and head to the home node within the CMS. Make a change and go to the Info app and click the Rollback button.

Check out the Services.RollBackContentFinder for information on the fetching and displaying of the rollbacked version.

Login: admin@example.com / 1234567890

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).  
  
Check out the project for release / updates [here](https://github.com/users/Rockerby/projects/2/views/1)  

## Acknowledgments

Mike Masey came up with the idea  
Matt Brailsford provided [the basis for converting internal models](https://gist.github.com/mattbrailsford/5f9638d357df59aeac1be8588a06c31e)  
Lotte Pitcher for her amazing [Opinionated Starter Kit](https://github.com/LottePitcher/opinionated-package-starter)
