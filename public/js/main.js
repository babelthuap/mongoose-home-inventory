'use strict';

$(document).ready(function() {

  $('.roomName').click(function() {
    console.log($(this))
    $(this).closest('h3').siblings('.items').slideToggle();
    $(this).siblings('.arrow').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
  });
  $('.fa-trash-o').click(removeRoom);

  $('.container').on('click', '.addItem', addItem);
  $('#addRoom').click(addRoom);
  $('#newRoomName').on('keypress', function(e) {
    if (e.keyCode === 13) addRoom();
  });

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
    .done(function() {
      console.log('remove room successful');
    })
    .fail(function(err) {
      console.log('remove room failed:', err);
    });
  }

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
});
