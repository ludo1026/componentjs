# component.js
Javascript Component with JQuery

# Component methods

- **$create** : Component creation
- **$init** : Data initialization (for REST calls, etc.)
- **$display** : Display
- **$watch** : Add watchers on components data updates
- **$events** : Add listeners on display elements by JQuery

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
