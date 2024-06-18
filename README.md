# Eucalyptus

![Annotated code](images/preview.gif)

Eucalyptus is an extension for VS Code that helps you create UI directory with predefined templates for React applications. 

Templates:
Diamond Template
Contains files: component, style, and index
Ruby Template
Contains files: component and index
Sapphire Template
Contains files: component and style
Emerald Template
Contains files: style and index

Installation:
Install the React Directory Creator extension from the Marketplace in VS Code.
https://marketplace.visualstudio.com/items?itemName=WoodenHands.eucalyptus

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Configuration

`eucalyptus.settings.useTypescript` - specify whether TypeScript should be used for UI component  
_Default: `true`_

`eucalyptus.settings.styleFormat` - specify the style format for UI component;  
_Available Options: `css`, `scss`, `less`_  
_Default: `scss`_
        
`eucalyptus.settings.useCssModules` - specify whether to use CSS Modules for importing styles for UI component  
_Default: `true`_
        
`eucalyptus.settings.shouldOpenAfterCreation` - should the UI directory files be opened after creation or not  
_Default: `false`_
