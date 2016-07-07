var Component = function(obj) {
  /**
   * $display:
   *  - Appel de la fonction "display()"
   *  - Appel de la fonction "display()" des sous-composants
   */
  Component.prototype.$display = function() {
    if(this.display instanceof Function) {
      this.display();
    }
  };
  /**
   * $events :
   *  - Affectation des listeners sur les actions sur les éléments de la page
   */
  Component.prototype.$events = function() {
    console.log('$events: '+this.name);
    if(this.events instanceof Object) {
      for(var eltId in this.events) {
        for(var eventName in this.events[eltId]) {
          if(this.events[eltId][eventName] instanceof Function) {
            console.log('eltId = '+eltId+', eventName = '+eventName);
            var elt = document.querySelector(eltId);
            if(elt) {
              elt.addEventListener(eventName, this.events[eltId][eventName].bind(this), false);
            } else {
              console.log('events : unknown element -',eltId);
            }
          }
        }
      }
    }
  };
  /**
   * $watch :
   *  - Détection des modifications dans l'objet data du composant
   *  - Appel de la méthode "refresh" de rafraîchissement global du composant
   *  - Appel de la fonction définie dans la propriété "watch" et correspondant
   *  au nom de la propriété qui vient d'être mise à jour dans data
   */
  Component.prototype.$watch = function() {
    if(this.watch instanceof Object) {
      for(var key in this.watch) {
        if (this.watch[key] instanceof Function) {
          if(this.data[key] == undefined) {
            this.data[key] = undefined;
          }
          watch(this.data, key, function (prop, action, newvalue, oldvalue) {
            this.watch[prop] = this.watch[prop].bind(this);
            this.watch[prop]();
          }.bind(this));
        }
      }
    }
    if(this.refresh instanceof Function) {
      watch(this.data, function (prop, action, newvalue, oldvalue) {
        if (this.refresh instanceof Function) {
          this.refresh(prop, action, newvalue, oldvalue);
        }
      }.bind(this), 0, true);
    }
  };
  /**
   * $update :
   *  - Mise à jour d'une ou plusieurs propriétés dans data
   */
  Component.prototype.$update = function(data) {
    for(var key in data) {
      this.data[key] = data[key];
    }
  };
  /**
   * $init :
   *  - Appel de la fonction "init" du composant
   *  - Appel des fonctions "init" des sous-composants
   */
  Component.prototype.$init = function() {
    if(this.init instanceof Function) {
      this.init();
    }
    this.$watch();
    this.$display();
    this.$events();
    if(this.components instanceof Object) {
      for(var componentName in this.components) {
        var component = this.components[componentName];
        if(component instanceof Component) {
          console.log('init - component - '+componentName);
          component.$init();
        }
      }
    }
  };
  /**
   * $create : Create component
   *  - Recopie dans "this" des propriétés de l'objet en paramètre du constructeur
   *  - Les fonctions sont bindés sur le this du composant
   *  - Appel à la fonction $watch pour la détection des modifications sur data
   *  - Appel à la fonction $display pour un premier affichage du composant
   *  - Appel à la fonction $events pour initialiser la gestion des événements
   */
  Component.prototype.$create = function() {
    for(var i=0; i<Object.keys(obj).length; i++) {
      var value = obj[Object.keys(obj)[i]];
      if(value instanceof Function) {
        this[Object.keys(obj)[i]] = value.bind(this);
      } else {
        this[Object.keys(obj)[i]] = value;
      }
    }
    if(this.data == null) {
      this.data = {};
    }
    if(this.components == null) {
      this.components = {};
    }
    if(this.events == null) {
      this.events = {};
    }
    if(this.methods == null) {
      this.methods = {};
    }
    if(this.methods instanceof Object) {
      for(var methodName in this.methods) {
        var method = this.methods[methodName];
        if(method instanceof Function) {
          this.methods[methodName] = method.bind(this);
        }
      }
    }
    if(this.create instanceof Function) {
      this.create();
    }
  };
  this.$create(obj);
};
