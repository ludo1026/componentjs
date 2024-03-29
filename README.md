# component.js
__Javascript Components__ - not need JQuery

Compatibility : IE 9+, Chrome, Firefox

Library dependencies : 
- watch.js - https://github.com/melanke/Watch.JS/

Sample - Calculator : https://jsfiddle.net/ludo1026/qfpcr00L/

# Component common methods

- **$create** : Component creation
- **$init** : Data initialization (for REST calls, etc.)
- **$display** : Display - insert HTML content by DOM manipulation or with Jquery
- **$watch** : Add watchers on components data updates
- **$events** : Add listeners on display elements by JQuery

To start a component, you must call **$init** on this component :
- **$init** must be called on the parent component which initializes its existing children components
- **$init** must be called on each new sub components added after the initialization of the parent component.

# Component methods/properties to redefine

```js
new Component({
```

- **data** : Component data
```js
  data: {
    var1: 'value1',
    var2: 'value2'
  }
```
- **components** : Sub components of the component
```js
  components: {
    component1: new Component({}),
    component2: new Component({})
  }
```
- **create** : method - Component creation - called by **$create** component method
```js
  create: function() {
    // Create component elements like sub components
    this.components.component3 = new Component({});
  }
```
- **init** : method - Data initialization (for REST calls, etc.) - called by **$init** component method
```js
  init: function() {
    // Data initialisation
    this.data.var1 = 'value1';
    // Rest
    $.get( "rest/", function( data ) {
      this.data.var1 = data;
    });
  }
```
- **display** : method - Component display - called by **$display** component method
```js
  display: function() {
    // by jquery
    $('#id').html('<p>Hello !</p>');
    // by DOM
    document.getElementById('id').innerHtml = '<p>Hello !</p>';
  }
```
- **watch** : object - Actions for data properties updates - used by **$watch** component method
```js
  watch: {
    var1: function() {
      // Update of 'data.var1'
      // Actions to do
    },
    var2: function() {
      // Update of 'data.var2'
      // Actions to do
    }
  }
```

- **events** : object - listeners on display elements - used by **$events** component method
```js
  events: {
    'jquery selector' : { '<event>': function() {} },
    'input[name="firstname"]': { 'keyup': function() { ... } }
  }
```

```js
})
```

# Hello World

```html
<div id="view"></div>
<script>
  new Component({
    display: function() {
      document.getElementById('view').innerHTML = '<h1>Hello World</h1>';
    }
  })
  .$init();
</script>
```
JSFiddle : https://jsfiddle.net/ludo1026/o817wrbk/

# Events listener

```html
<div id="view"></div>
<script>
  new Component({
    display: function() {
      document.getElementById('view').innerHTML = '<h1>Please click on "Hello World"</h1>';
    },
    events: {
      'h1': {
        click: function() {
          alert('click');
        }
      }
    }
  })
  .$init();
</script>
```
JSFiddle : https://jsfiddle.net/ludo1026/7mpgdrv4/

# Watch

```html
<div id="view"></div>
<script>
  new Component({
    display: function() {
       document.getElementById('view').innerHTML = 
        '<h1>Hello World</h1>' +
        '<label for="title">Change title :</label>' +
        '<input type="text" name="title" id="title" />';
    },
    watch: {
      title: function() {
         document.querySelector('h1').innerText = this.data.title;
      }
    },
    events: {
      'input[name="title"]': {
        keyup: function() {
          this.data.title = document.querySelector('input[name="title"]').value;
        }
      }
    }
  })
  .$init();
</script>
```
JSFiddle : https://jsfiddle.net/ludo1026/36psqsgm/

# Counter

```html
<div id="view"></div>
<script>
  new Component({
    data: {
      counter: 0
    },
    display: function() {
      document.getElementById('view').innerHTML = 
        '<h1>Counter</h1>' +
        '<p id="counter" />';
    },
    watch: {
      counter: function() {
        document.getElementById('counter').innerText = this.data.counter;
      }
    },
    init: function() {
      setInterval(function(){
        this.data.counter += 1;
      }.bind(this), 100);
    }
  })
  .$init();
</script>
```
JSFiddle : https://jsfiddle.net/ludo1026/8jj2tqzd/

# Date formater

```html
<div id="view"></div>
<script>
  function DateDisplayComponent(htmlId) {
    return new Component({
      data: {
        date: null
      },
      display: function() {
        if(this.data.date != null) {
          var dateAsText = this.data.date.format('MMMM Do YYYY, h:mm:ss a');
        } else {
          var dateAsText = 'please define the date'
        }
        document.getElementById(htmlId).innerHTML =
          '<p>' + dateAsText + '</p>';
      },
      watch: {
        date: function() {
          this.$display();
        }
      }
    })
  }

  function MainComponent(htmlId) {
    return new Component({
      data: {
        date: moment()
      },
      create: function() {
        this.components.dateDisplay = DateDisplayComponent('dateDisplay');
      },
      display: function() {
        document.getElementById(htmlId).innerHTML =
          '<h1>Date</h1>' +
          '<input type="date" name="date" />' +
          '<div id="dateDisplay"></div>';
      },
      watch: {
        date: function() {
          this.components.dateDisplay.$update({
            date: this.data.date
          })
        }
      },
      events: {
        'input[type="date"]': {
          change: function() {
            var dateAsText = document.querySelector('input[type="date"]').value;
            this.data.date = moment(dateAsText);
          }
        }
      }
    })
  }

  MainComponent('view').$init();
</script>
```
JSFiddle : https://jsfiddle.net/ludo1026/1qxr8gvf/

# Posts (REST call)

```html
<div id="view"></div>
<script>
  function PostsDisplayComponent(htmlId) {
    return new Component({
      display: function() {
        if(this.data.posts == null) {
          var html = 'no post'
        } else {
          var html = '';
          for(var i=0; i<this.data.posts.length; i++) {
            var post = this.data.posts[i];
            html += '<div class="post">' +
                    '<div class="title">'+post.title+'</div>' +
                    '<div class="body">'+post.body+'</div>' +
                    '</div>';
          }
        }
        $(htmlId).html(html);
      },
      watch: {
        posts: function() {
          this.$display();
        }
      }
    })
  }

  function MainComponent(htmlId) {
    return new Component({
      data: {
        posts: []
      },
      components: {
        postsDisplay: PostsDisplayComponent('#posts')
      },
      init: function() {
        $.get('http://jsonplaceholder.typicode.com/posts', function(posts) {
          this.data.posts = posts;
        }.bind(this));
      },
      display: function() {
        $(htmlId).html([
          '<h1>Posts</h1>',
          '<div id="posts"></div>'
        ]);
      },
      watch: {
        posts: function() {
          this.components.postsDisplay.$update({
            posts: this.data.posts
          })
        }
      }
    })
  }

  MainComponent('#view').$init();
</script>
```
JSFiddle : https://jsfiddle.net/ludo1026/fbcx846w/

# Post - with a component for each post

```html
<div id="view"></div>
<script>
  function PostDisplayComponent(htmlId) {
    return new Component({
      display: function() {
        if(this.data.post == null) {
          return;
        }

        $(htmlId).html(
          '<div class="post">'+
          '<div class="title">'+this.data.post.title+'</div>'+
          '<div class="body">'+this.data.post.body+'</div>'+
          '</div>'
        );
      },
      watch: {
        post: function() {
          this.$display();
        }
      }
    })
  }
  
  function PostsDisplayComponent(htmlId) {
    return new Component({
      display: function() {
        if(!this.data.posts) {
          return;
        }
        var html = '';
        for(var i=0; i<this.data.posts.length; i++) {
          var post = this.data.posts[i];
          html += '<div id="post_' + post.id + '"></div>';
        }
        $(htmlId).html(html);
      },
      watch: {
        posts: function() {
          this.$display();
          this.definePostDisplays();
        }
      },
      definePostDisplays: function() {
        if(!this.data.posts) {
          return;
        }
        for(var i=0; i<this.data.posts.length; i++) {
          var post = this.data.posts[i];
          var component = this.components[post.id];
          if(component == null) {
            component = this.components[post.id] = PostDisplayComponent('#post_'+post.id);
          }
          component.$init();
          component.$update({
            post: post
          })
        }
      }
    })
  }

  function MainComponent(htmlId) {
    return new Component({
      data: {
        posts: []
      },
      components: {
        postsDisplay: PostsDisplayComponent('#posts')
      },
      init: function() {
        $.get('https://jsonplaceholder.typicode.com/posts', function(posts) {
          this.data.posts = posts;
        }.bind(this));
      },
      display: function() {
        $(htmlId).html([
          '<h1>Posts</h1>',
          '<div id="posts"></div>'
        ]);
      },
      watch: {
        posts: function() {
          this.components.postsDisplay.$update({
            posts: this.data.posts
          })
        }
      }
    })
  }

  MainComponent('#view').$init();
</script>
```
JSFiddle : https://jsfiddle.net/ludo1026/fbvh1ng8/

# Todo list

```html
<div id="view"></div>
<script>
function NewPostComponent(htmlId, parent) {
    return new Component({
      display: function() {
        $(htmlId).html(
          '<input type="text" name="title" />' +
          '<button id="add">Add</button>'
        );
      },
      watch: {
        title: function() {
          $('input[name="title"]').val(this.data.title);
        }
      },
      events: {
        'input[name="title"]': {
          keyup: function(e) {
            this.data.title = $('input[name="title"]').val();
            if(e.which == 13) {
              this.addTodo();
            }
          }
        },
        '#add': {
          click: function() {
            this.addTodo()
          }
        }
      },
      addTodo: function() {
        parent.data.todos.push({
          title: this.data.title
        })
        this.data.title = '';
      }
    })
  }
  
  function TodoListComponent(htmlId) {
    return new Component({
      display: function() {
        var html = '';
        if(this.data.todos) {
          for(var i=0; i<this.data.todos.length; i++) {
            var todo = this.data.todos[i];
            html += '<div class="todo">' + todo.title + '</div>';
          }
        }
        $(htmlId).html(html);
      },
      refresh: function() {
        this.$display();
      }
    })
  }

  function MainComponent(htmlId) {
    return new Component({
      data: {
        todos: [{
          title: 'Todo 1'
        },{
          title: 'Todo 2'
        }]
      },
      init: function() {
        this.components.newPostDisplay = NewPostComponent('#new', this);
        this.components.postsDisplay = TodoListComponent('#list');
        this.components.postsDisplay.$update({
          todos: this.data.todos
        });
      },
      display: function() {
        $(htmlId).html([
          '<h1>Todo list</h1>',
          '<div id="new"></div>',
          '<div id="list"></div>'
        ]);
      },
      watch: {
        todos: function() {
          console.log('update')
          this.components.postsDisplay.$update({
            todos: this.data.todos
          })
        }
      }
    })
  }

  MainComponent('#view').$init();
</script>
```

JSFiddle: https://jsfiddle.net/ludo1026/unchver2/
