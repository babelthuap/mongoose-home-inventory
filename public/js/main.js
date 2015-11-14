'use strict';

$(document).ready(function() {

  $('h3').click(function() {
    $(this).siblings('.items').slideToggle();
    $(this).find('.fa').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
  });

  $('.container').on('click', '.addItem', addItem);
  $('#addRoom').click(addRoom);

  function addItem() {
    var $table = $(this).siblings('table'),
        roomId = $(this).closest('.room').data('mongoid').slice(1, -1),
        name = $table.find('.newName').val(),
        value = Number( $table.find('.newValue').val().replace('$', '') ),
        description = $table.find('.newDescription').val();
    
    if (name && value) {
      // add item to collection of items
      $.ajax({
        method: 'POST',
        url: '/items',
        data: {name: name, value: value, description: description}
      })
      .done(function(itemId) {

        $.ajax({
          method: 'PUT',
          url: `/rooms/${roomId}/addItem/${itemId}`,
        })
        .done(function() {
          // display new item on the page
          var $newItem = $('<tr>');
          $newItem.append( $('<td>').text(name) )
                  .append( $('<td>').text('$' + value.toFixed(2)) )
                  .append( $('<td>').text(description) );
          $table.find('tr').last().before( $newItem );
          $table.find('input').val('');
        })
        .fail(function(err) {
          console.log('add item to room failed:', err.responseText)
        });

      })
      .fail(function(err) {
        console.log('add item to items failed:', err.responseText)
      });

    }
  };

  function addRoom() {
    console.log('ADD NEW ROOM');
  }

});
