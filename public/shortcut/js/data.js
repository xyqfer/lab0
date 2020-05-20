const data = [
    {
        category: "General",

        shortcuts: 
        [
    
        {
            command: `⇧⌘P, F1`,
            description: `Show Command Palette`
        },
        {
            command: `⌘P`,
            description: `Quick Open, Go to File…`
        },
        {
            command: `⇧⌘N`,
            description: `New window/instance`
        },
        {
            command: `⌘W`,
            description: `Close window/instance`
        },
        {
            command: `⌘,`,
            description: `User Settings`
        },
        {
            command: `⌘K ⌘S`,
            description: `Keyboard Shortcuts`
        },
        
        ]  
    },
    { 
        category: "Basic editing",

        shortcuts: 
        [
    
        {
            command: `⌘X`,
            description: `Cut line (empty selection)`
        },
        {
            command: `⌘C`,
            description: `Copy line (empty selection)`
        },
        {
            command: `⌥↓ / ⌥↑`,
            description: `Move line down/up`
        },
        {
            command: `⇧⌥↓ / ⇧⌥↑`,
            description: `Copy line down/up`
        },
        {
            command: `⇧⌘K`,
            description: `Delete line`
        },
        {
            command: `⌘Enter / ⇧⌘Enter`,
            description: `Insert line below/above`
        },
        // {
        //     command: "⇧⌘\" , 
        //     description: `Jump to matching bracket`
        // },
        {
            command: `⌘] / ⌘[`,
            description: `Indent/outdent line`
        },
        {
            command: `Home / End`,
            description: `Go to beginning/end of line`
        },
        {
            command: `⌘↑ / ⌘↓`,
            description: `Go to beginning/end of file`
        },
        {
            command: `⌃PgUp / ⌃PgDn`,
            description: `Scroll line up/down`
        },
        {
            command: `⌘PgUp /⌘PgDn`,
            description: `Scroll page up/down`
        },
        {
            command: `⌥⌘[ / ⌥⌘]`,
            description: `Fold/unfold region`
        },
        {
            command: `⌘K ⌘[ / ⌘K ⌘]`,
            description: `Fold/unfold all subregions`
        },
        {
            command: `⌘K ⌘0 / ⌘K ⌘J`,
            description: `Fold/unfold all regions`
        },
        {
            command: `⌘K ⌘C `,
            description: `Add line comment`
        },
        {
            command: `⌘K ⌘U`,
            description: `Remove line comment`
        },
        {
            command: `⌘/`,
            description: `Toggle line comment`
        },
        {
            command: `⇧⌥A`,
            description: `Toggle block comment`
        },
        {
            command: `⌥Z`,
            description: `Toggle word wrap`
        },

        ]
    },
    { 
        category: "Multi-cursor and selection",

        shortcuts: 
        [
    
        {
            command: `⌥ + click`,
            description: `Insert cursor`
        },
        {
            command: ` ⌥⌘↑`,
            description: `Insert cursor above`
        },
        {
            command: `⌥⌘↓`,
            description: `Insert cursor below`
        },
        {
            command: `⌘U`,
            description: `Undo last cursor operation`
        },
        {
            command: `⇧⌥I`,
            description: `Insert cursor at end of each line selected`
        },
        {
            command: `⌘L`,
            description: `Select current line`
        },
        {
            command: `⇧⌘L`,
            description: `Select all occurrences of current selection`
        },
        {
            command: `⌘F2`,
            description: `Select all occurrences of current word`
        },
        {
            command: `⌃⇧⌘→ / ←`,
            description: `Expand / shrink selection`
        },
        {
            command: `⇧⌥ + drag mouse`,
            description: `Column (box) selection`
        },
        {
            command: `⇧⌥⌘↑ / ↓`,
            description: `Column (box) selection up/down`
        },
        {
            command: `⇧⌥⌘← / →`,
            description: `Column (box) selection left/right`
        },
        {
            command: `⇧⌥⌘PgUp`,
            description: `Column (box) selection page up`
        },
        {
            command: `⇧⌥⌘PgDn`,
            description: `Column (box) selection page down`
        },

        ]
    },
    { 
        category: "Search and replace",

        shortcuts: 
        [

        {
            command: `⌘F`,
            description: `Find`
        },
        {
            command: `⌥⌘F`,
            description: `Replace`
        },
        {
            command: `⌘G / ⇧⌘G`,
            description: `Find next/previous`
        },
        {
            command: `⌥Enter`,
            description: `Select all occurrences of Find match`
        },
        {
            command: `⌘D`,
            description: `Add selection to next Find match`
        },
        {
            command: `⌘K ⌘D`,
            description: `Move last selection to next Find match`
        },

        ]  
    },
    { 
        category: "Rich languages editing",

        shortcuts: 
        [

        {
            command: `⌃Space`,
            description: `Trigger suggestion`
        },
        {
            command: `⇧⌘Space`,
            description: `Trigger parameter hints`
        },
        {
            command: `⇧⌥F`,
            description: `Format document`
        },
        {
            command: `⌘K ⌘F`,
            description: `Format selection`
        },
        {
            command: `F12`,
            description: `Go to Definition`
        },
        {
            command: `⌥F12`,
            description: `Peek Definition`
        },
        {
            command: `⌘K F12`,
            description: `Open Definition to the side`
        },
        {
            command: `⌘.`,
            description: `Quick Fix`
        },
        {
            command: `⇧F12`,
            description: `Show References`
        },
        {
            command: `F2`,
            description: `Rename Symbol`
        },
        {
            command: `⌘K ⌘X`,
            description: `Trim trailing whitespace`
        },
        {
            command: `⌘K M`,
            description: `Change file language`
        },

        ]  
    },
    { 
        category: "Navigation", 
      
        shortcuts: 
        [

        {
            command: `⌘T`,
            description: `Show all Symbols`
        },
        {
            command: `⌃G`,
            description: `Go to Line...`
        },
        {
            command: `⌘P`,
            description: `Go to File...`
        },
        {
            command: `⇧⌘O`,
            description: `Go to Symbol...`
        },
        {
            command: `⇧⌘M`,
            description: `Show Problems panel`
        },
        {
            command: `F8 / ⇧F8`,
            description: `Go to next/previous error or warning`
        },  
        {
            command: `⌃⇧Tab`,
            description: `Navigate editor group history`
        },
        {
            command: `⌃- / ⌃⇧-`,
            description: `Go back/forward`
        },
        {
            command: `⌃⇧M`,
            description: `Toggle Tab moves focus`
        },

        ]  
    },   
    { 
        category: "Editor management", 
        
        shortcuts: 
        [
        {
            command: `⌘W`,
            description: `Close editor`
        },
        {
            command: `⌘K F`,
            description: `Close folder`
        },
        // {
        //     command: "⌘\",
        //     description: `Split editor`
        // },
        {
            command: `⌘1 / ⌘2 / ⌘3`,
            description: `Focus into 1st, 2nd, 3rd editor group`
        },
        {
            command: `⌘K ⌘← / ⌘K ⌘→`,
            description: `Focus into previous/next editor group`
        },
        {
            command: `⌘K ⇧⌘← / ⌘K ⇧⌘→`,
            description: `Move editor left/right`
        },  
        {
            command: `⌘K ← / ⌘K →`,
            description: `Move active editor group`
        },

        ]  
    },  
    { 
        category: "File management", 
        
        shortcuts: 
        [

        {
            command: `⌘N`,
            description: `New File`
        },
        {
            command: `⌘O`,
            description: `Open File...`
        },
        {
            command: `⌘S`,
            description: `Save`
        },
        {
            command: `⇧⌘S`,
            description: `Save As...`
        },
        {
            command: `⌥⌘S`,
            description: `Save All`
        },
        {
            command: `⌘W`,
            description: `Close`
        },  
        {
            command: `⌘K ⌘W`,
            description: `Close All`
        },
        {
            command: `⇧⌘T`,
            description: `Reopen closed editor`
        },
        {
            command: `⌘K Enter`,
            description: `Keep preview mode editor open`
        },
        {
            command: `⌃Tab / ⌃⇧Tab`,
            description: `Open next / previous`
        },
        {
            command: `⌘K P`,
            description: `Copy path of active file`
        },
        {
            command: `⌘K R`,
            description: `Reveal active file in Finder`
        },
        {
            command: `⌘K O`,
            description: `Show active file in new window/instance`
        },

        ]  
    }, 
    { 
        category: "Display", 
        
        shortcuts: 
        [

        {
            command: `⌃⌘F`,
            description: `Toggle full screen`
        },
        {
            command: `⌥⌘0`,
            description: `Toggle editor layout (horizontal/vertical)`
        },
        {
            command: `⌘= / ⇧⌘-`,
            description: `Zoom in/out`
        },
        {
            command: `⌘B`,
            description: `Toggle Sidebar visibility`
        },
        {
            command: `⇧⌘E`,
            description: `Show Explorer / Toggle focus`
        },
        {
            command: `⇧⌘F`,
            description: `Show Search`
        },  
        {
            command: `⌃⇧G`,
            description: `Show Source Control`
        },
        {
            command: `⇧⌘D`,
            description: `Show Debug`
        },
        {
            command: `⇧⌘X`,
            description: `Show Extensions`
        },
        {
            command: `⇧⌘H`,
            description: `Replace in files`
        },
        {
            command: `⇧⌘J`,
            description: `Toggle Search details`
        },
        {
            command: `⇧⌘U`,
            description: `Show Output panel`
        },
        {
            command: `⇧⌘V`,
            description: `Open Markdown preview`
        },
        {
            command: `⌘K V`,
            description: `Open Markdown preview to the side`
        },
        {
            command: `⌘K Z`,
            description: `Zen Mode (Esc Esc to exit)`
        },

        ]  
    }, 
    { 
        category: "Debug", 
        
        shortcuts: 
        [
        {
            command: `F9`,
            description: `Toggle breakpoint`
        },
        {
            command: `F5`,
            description: `Start/Continue`
        },
        {
            command: `F11 / ⇧F11`,
            description: `Step into/ out`
        },
        {
            command: `F10`,
            description: `Step over`
        },
        {
            command: `⇧F5`,
            description: `Stop`
        },
        {
            command: `⌘K ⌘I`,
            description: `Show hover`
        },  
        
        ]  
    }, 
    { 
        category: "Integrated terminal", 
        
        shortcuts: 
        [

        {            
            command: '⌃`',
            description: `Show integrated terminal`
        },
        {
            command: '⌃⇧`',
            description: `Create new terminal`
        },
        {
            command: `⌘C`,
            description: `Copy selection`
        },
        {
            command: `⌘↑ / ↓`,
            description: `Scroll up/down`
        },
        {
            command: `PgUp / PgDn`,
            description: `Scroll page up/down`
        },
        {
            command: `⌘Home / End `,
            description: `Scroll to top/bottom`
        }, 

        ]  
    }, 
]