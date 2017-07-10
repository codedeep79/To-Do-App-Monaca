var todo = {
    filterFlag: 'all',
    events: []
};

document.addEventListener('init', function(event){
    var view = event.target.id;
    
    if (view === 'menu' || view === 'list'){
        
        // todo[listInit](event.target) 
        // event.target: Là các thẻ con, id con trong #list
        todo[view + 'Init'](event.target);
    }
}, false);


todo.listInit = function(target){
    this.list = document.querySelector('#todo-list');
    
    target.querySelector('#splitter-toggle').addEventListener('click', function(){
        document.querySelector('#splitter-menu').open();
    });
    
    target.querySelector('#add').addEventListener('click', this.addItemPrompt.bind(this));
    
    todoStorage.init();
    todo.refresh();
};


todo.addItemPrompt = function(){
    ons.notification.prompt('Insert New To-Do Item Label',{
        title: 'New Item',
        cancelable: true,
        
        // Label là dữ liệu đã móc ra
        callback: function(label) {
            if (label === '' || label === null)
            {
                return;
            }
            
            if (todoStorage.add(label))
            {
                todo.refresh();
            }
            else
            {
                ons.notification.alert('Failed To Add Item To The ToDo List!!');
            }
        }.bind(this)
  });
};

todo.toggleStatus = function(label){
      if (todoStorage.toggleStatus(label))
      {
          this.refresh();
      }
      else
      {
          ons.notification.alert("Failed TO Change The Status Of Selected Item!");
      }
  }
  
todo.removeItemPrompt = function(label){
      ons.notification.confirm("Are You Would You Like To Remove ? "
        + label 
        + "From ToDo List", {
            title : "Remove Items ?",
            callback: function(answer) {
                if (answer === 1)
                {
                    if (todoStorage.remove(label))
                    {
                        this.refresh();
                    }
                    else
                    {
                        ons.notification.alert("Failed To Remove Item From ToDo List!");
                    }
                }
            }.bind(this)
        });
}

// Chọn Trên Menu 
todo.menuInit = function(target){
    target.querySelector("ons-list").addEventListener('click', this.filter.bind(this));
}

todo.filter = function(e){
    this.filterFlag = e.target.parentElement.getAttribute('data-filter') || 'all';
    this.refresh();
}

// The bind() method creates a new function that, when called, has its this keyword set 
// to the provided value, with a given sequence of arguments preceding any provided when 
// the new function is called.

todo.refresh = function(){
  var items = todoStorage.filter(this.filterFlag); 
  
  // this: todo
  // Lây tất cả giá trị trong items
  this.list.innerHTML = items.map(function(item)
  {
      // Thay thế chỗ nào trong #todo-list-item có {{label}}, {{checked}}
      // là item.label, item.status
        return document.querySelector('#todo-list-item').innerHTML
        .replace('{{label}}', item.label)
        .replace('{{checked}}', item.status === 'completed' ? 'checked' : '');
        
       
  }).join(''); 
  
  // Lấy ra các thẻ con trong id = list
  var children = this.list.children;
  
  this.events.forEach(function(eventElement, index) {
        eventElement.element.removeEventListener('click', eventElement.function);
  });
  
  this.events = [];
  
  var event = {};
  
  // Duyệt các phần tử items của todoStorage
  items.forEach(function(ele, index) {
      event = {
          element: children[index].querySelector("ons-input"),
          function: todo.toggleStatus.bind(this, ele.label)
      };
      
      this.events.push(event);
      event.element.addEventListener('click', event.function);
      
      event = {
          element: children[index].querySelector("ons-icon"),
          function: todo.removeItemPrompt.bind(this, ele.label)
      };
      
      this.events.push(event);
      event.element.addEventListener('click', event.function);
      
  }.bind(todo));
  
  
  
}

