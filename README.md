things-happened-angularjs
=========================

use things-happened with angular

## README Contents

- [installation](#a)
- [run tests](#b)
- [build](#c)
- [usage] (#d)

<a name="a"/>
## installation

you need npm and bower:
```
npm install
bower install
```

<a name="b"/>
## run tests

two ways are possible.

### run over grunt

```
grunt test
```

### run over karma
```
karma start src/test/karma.conf.js
```

<a name="c"/>
## build
```
grunt default
```

<a name="d"/>
## usage

Just a small example query yet. See examples and jasmine tests for more examples and visit http://things-happened.org

```html
<!-- add a movie into the database on form submit -->
<form things-addto="movies liketosee" method="POST">
  <fieldset>
    <input type="text" name="title" placeholder="title" /><br />
    <input type="date" name="date" placeholder="date" /><br />
    <button type="submit">Add now</button>
  </fieldset>
</form>
```

```html
<!-- list all movies from database -->
<ul>
  <li things-repeat="movie in movies">{{movie.date}} {{movie.title}}</li>
</ul>
```