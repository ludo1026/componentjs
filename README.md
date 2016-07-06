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
