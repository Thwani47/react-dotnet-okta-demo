# react-dotnet-okta-demo
A demo app to see how to do AuthN and AuthZ in a React + .NET app using Okta

This is not a fully functional app, just a quick demo on how to setup a React frontend and a .NET backend to use Okta for authentication and authorization.

The API has has 3 endpoints:
- GET /hello --> A public endpoint that needs not authorization
- GET /whoami --> An endpoint that requires the user to be authenticated
- GET /weatherforecast --> An endpoint that requires the user to be authenticated