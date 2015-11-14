'use strict';

$(document).ready(function() {

  $('.roomName').click(function() {
    $(this).closest('h3').siblings('.items').slideToggle();
    $(this).siblings('.arrow').toggleClass('fa-caret-up fa-caret-down');
  });
  $('.fa-trash-o').click(removeRoom);
  $('.items').on('click', '.remove-item', removeItem)

  $('.container').on('click', '.addItem', addItem);
  $('#addRoom').click(addRoom);

  function addRoom() {
    var name = $('#newRoomName').val();
    if (!name) return;
    $('*').off('click');

    $.post('/rooms', {name: name})
    .done(function(roomId) {
      location.reload(true);
    })
    .fail(function(err) {
      console.log('add new room failed:', err);
    });
  }

  function removeRoom() {
    var $room = $(this).closest('.room');
    var roomId = $room.data('mongoid').slice(1, -1);
    $room.remove();

    $.ajax({
      method: 'DELETE',
      url: `/rooms/${roomId}`
    })
    .fail(function(err) {
      console.log('remove room failed:', err);
    });
  }

  function removeItem() {
    var $item = $(this).closest('tr');
    var itemId = $item.data('mongoid').slice(1, -1);

    $.ajax({
      method: 'DELETE',
      url: `/items/${itemId}`
    })
    .done(function() {
      $item.remove();
    })
    .fail(function(err) {
      console.log('remove item failed:', err);
    });
  }

  function addItem() {
    var $table = $(this).siblings('table'),
        roomId = $(this).closest('.room').data('mongoid').slice(1, -1),
        name = $table.find('.newName').val(),
        value = Number( $table.find('.newValue').val().replace('$', '') ),
        description = $table.find('.newDescription').val();

    $table.find('input').val('');

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
          var $button = $('<button>').addClass('btn btn-default fa fa-times remove-item');
          var $newItem = $('<tr>').data('mongoid', `"${itemId}"`);
          $newItem.append( $('<td>').text(name) )
                  .append( $('<td>').text('$' + value.toFixed(2)) )
                  .append( $('<td>').text(description) )
                  .append( $('<td>').append($button) )
          $table.find('tr').last().before( $newItem );
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
});
