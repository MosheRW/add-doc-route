# add doc route

## description 
this package is getting a path for a yaml OpenAPI file, and returns an express router with five routs.
1. the yaml file.
2. the json file.
3. swagger web page.
4. redocly web page.
5. visual 'menu page' with buttons for those three routes. 

## installation
simply use `npm i add-doc-route`.</br>
or `npm i --save-dev add-doc-route` if you not intending to use it in production.

## **new feature !!!**  add-soc-route CLI
now you can display any openAPI/swagger/Redocly file in json or yaml formats using `npx add-doc-route --run <the path to the file>` in it will  immediately display in the browser.