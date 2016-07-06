# component.js
Javascript Component with JQuery

# Component methods

- **$create** : Component creation
- **$init** : Data initialization (for REST calls, etc.)
- **$display** : Display
- **$watch** : Add watchers on components data updates
- **$events** : Add listeners on display elements by JQuery

# Component object properties

- **data** : Component data
```js
new Component({
  data: {
    var1: 'value1',
    var2: 'value2'
  }
})
```
- **components** : Sub components of the component
```js
new Component({
  components: {
    component1: new Component({}),
    component2: new Component({})
  }
})
```

# Hello World

```html
<div id="view"></div>
<script>
  new Component({
    display: function() {
      $('#view').html('<h1>Hello World</h1>');
    }
  })
</script>
```

# Events listener

```html
<div id="view"></div>
<script>
  new Component({
    display: function() {
      $('#view').html('<h1>Hello World</h1>');
    },
    events: {
      'h1': {
        click: function() {
          alert('click');
        }
      }
    }
  })
</script>
```

# Watch

```html
<div id="view"></div>
<script>
  new Component({
    display: function() {
      $('#view').html([
        '<h1>Hello World</h1>',
        '<label for="title">Change title :</label>',
        '<input type="text" name="title" id="title" />'
      ]);
    },
    watch: {
      title: function() {
        $('h1').text(this.data.title);
      }
    },
    events: {
      'input[name="title"]': {
        keyup: function() {
          this.data.title = $('input[name="title"]').val();
        }
      }
    }
  })
</script>
```

# Counter

```html
<div id="view"></div>
<script>
  new Component({
    data: {
      counter: 0
    },
    display: function() {
      $('#view').html([
        '<h1>Counter</h1>',
        '<p id="counter" />'
      ]);
    },
    watch: {
      counter: function() {
        $('#counter').text(this.data.counter);
      }
    },
    init: function() {
      setInterval(function(){
        this.data.counter += 1;
      }.bind(this), 100);
    }
  })
</script>
```

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
        $(htmlId).html([
          '<p>',
          dateAsText,
          '</p>'
        ]);
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
        this.components.dateDisplay = DateDisplayComponent('#dateDisplay');
      },
      display: function() {
        $(htmlId).html([
          '<h1>Date</h1>',
          '<input type="date" name="date" />',
          '<div id="dateDisplay"></div>'
        ]);
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
            var dateAsText = $('input[type="date"]').val();
            this.data.date = moment(dateAsText);
          }
        }
      }
    })
  }
  
  MainComponent('#view');
</script>
```
