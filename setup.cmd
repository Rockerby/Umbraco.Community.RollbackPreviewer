@ECHO OFF
:: This file can now be deleted!
:: It was used when setting up the package solution (using https://github.com/LottePitcher/opinionated-package-starter)

:: set up git
git init
git branch -M main
git remote add origin https://github.com/Rockerby/Umbraco.Community.RollbackPreviewer.git

:: ensure latest Umbraco templates used
dotnet new install Umbraco.Templates --force

:: use the umbraco-extension dotnet template to add the package project
cd src
dotnet new umbraco-extension -n "Umbraco.Community.RollbackPreviewer" --site-domain "https://localhost:44355" --include-example --allow-scripts Yes

:: replace package .csproj with the one from the template so has nuget info
cd Umbraco.Community.RollbackPreviewer
del Umbraco.Community.RollbackPreviewer.csproj
ren Umbraco.Community.RollbackPreviewer_nuget.csproj Umbraco.Community.RollbackPreviewer.csproj

:: add project to solution
cd..
dotnet sln add "Umbraco.Community.RollbackPreviewer"

:: add reference to project from test site
dotnet add "Umbraco.Community.RollbackPreviewer.TestSite/Umbraco.Community.RollbackPreviewer.TestSite.csproj" reference "Umbraco.Community.RollbackPreviewer/Umbraco.Community.RollbackPreviewer.csproj"
