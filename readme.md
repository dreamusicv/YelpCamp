REST: Representational State Transfer
        -A mapping between HTTP and CRUD

CRUD: Create Read Update Destroy

RESTFUL ROUTES 

name        url                 verb        desc.
==================================================================================================
INDEX       /topic              GET         List all items
NEW         /topic/new          GET         Displays a form to make a new object about the topic 
CREATE      /topic              POST        Create a new item, then redirect to somewhere
SHOW        /topic/:id          GET         Shows info about an item
EDIT        /topic/:id/edit     GET         Show edit form for an item
UPDATE      /topic/:id          PUT         Update a particular item, then redirect to somewhere
DESTROY     /topic/:id          DELETE      Delete a particular item, then redirect to somewhere       