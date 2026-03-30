---
title: Loot Tables
description: Create, modify, import, export, and launch loot tables, PF2e/DnD 5e.
author: GM Tools & Resources
image: https://thp21000.github.io/loot-tables-for-OBR/store-cover.png
icon: https://thp21000.github.io/loot-tables-for-OBR/icon.svg
tags:
  - tool
  - automation
manifest: https://thp21000.github.io/loot-tables-for-OBR/manifest.json
learn-more: https://github.com/thp21000/loot-tables-for-OBR/
---
![Partage](Partage.gif)
An Owlbear Rodeo extension to create, edit, import, export, and roll loot tables, with support for multiple game systems.

### Features

- Create and edit loot tables
- Support for **PF2E** and **DND5E** systems (selector in UI)
- System/language selector moved to **Settings** (gear button), with FR/EN flag icons
- Item management with:
  - name
  - sheet URL
  - level
  - category
  - type (especially useful for DND5E)
  - rarity
  - value
- Local storage separated by system (PF2E and DND5E tables are isolated)
- Table sorting and search
- Collapsible item display
- JSON import / export
- CSV import / export (system-aware format)
- CSV import into an existing table
- Multi-paste from Excel
- Multi-paste accepts **tab**, **;**, and **,** separators
- FR/EN term recognition during import/paste for:
  - categories
  - rarities
  - types
  - currencies
- Simple duplicate detection on import
- Single modal for all file transfers (JSON/CSV import/export)
- Configurable roll with:
  - level range (min/max)
  - quantity range (min/max)
  - value range in cp (min/max)
  - magic item filter (PF2E only)
  - categories
  - duplicates allowed or not
  - probability mode
- Precise manual min/max input (synchronized with sliders)
- Currency labels are localized by language/system:
  - DND5E FR/EN: `pc/cp`, `pa/sp`, `pe/ep`, `po/gp`, `pp/pp`
  - PF2E FR/EN: `pc/cp`, `pa/sp`, `po/gp`, `pp/pp`
- Quick roll with last-used settings
- Local persistence of multiple UI states
- Floating action bar in table edit mode: **Save**, **Cancel**, **Back to top**

### Recommended backup

Loot tables are currently stored locally in your browser.  
It is strongly recommended to export JSON backups regularly to avoid data loss.

### Sample tables

Ready-to-use sample tables are available to quickly test the tool without creating content yourself.

👉 Access here:
https://www.patreon.com/posts/loot-tables-beta-154219405?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=postshare_creator&utm_content=join_link

Included:
- PF2E FR
- PF2E EN
- DnD5e FR
- DnD5e EN

These tables can be imported directly into the tool.

---

### Support the project

If you want to support the project:

👉 https://www.patreon.com/15711449/join

The **GM Supporter** tier gives access to:

- early access to beta versions
- ready-to-use loot tables (FR / EN, PF2E & DnD5e)
- progressively added content
- ability to influence future features

Your support helps accelerate development and expand the available content.

### Usage

#### Choose system
![Multi](Multi.gif)
- Open **Settings** (gear button).
- Use **PF2E / DND5E** buttons.
- System switch reloads the target system tables.
- Each system has its own local storage.
- Switching system does not delete anything: it simply shows the other table space.

#### Create a table
![Create](Create.gif)
- Click **Create a new table**
- Give your table a name
- Add items row by row
- Save the table

#### Import items
![Export](Export.gif)
Two options:

- import a CSV as a new table
- import a CSV into an existing table

When importing into an existing table, you can:
- append items
- replace existing items

Simple duplicates are ignored during import.
Imported values are normalized to support heterogeneous sources (FR/EN terms, singular/plural variants for some categories).

#### Roll loot
![Tirage](Tirage.gif)
Two options:

- green **▶** button: opens full roll configuration
- yellow **⚡** button: quick roll with last-used settings

#### Expected CSV formats

##### PF2E

Expected columns:
- `name`
- `url`
- `level`
- `category`
- `rarity`
- `magic`
- `valueAmount`
- `valueCurrency`

Available categories
- `Weapons`
- `Armors`
- `Consumable`
- `Container`
- `Equipment`
- `Treasure`
- `Other`

Available rarities
- `Common`
- `Uncommon`
- `Rare`
- `Unique`

Available magic
- `Yes`
- `No`

Notes:
- `type` is not expected in PF2E format.
- `pe/ep` is not offered in PF2E currency options in the UI.

Example: 

```csv
name;url;level;category;rarity;valueAmount;valueCurrency
Short Sword;https://example.com;1;Weapon;Common;9;sp
Healing Potion;https://example.com;1;Consumable;Common;4;gp
```

##### DND5E

Expected columns:
- `name`
- `url`
- `category`
- `type`
- `rarity`
- `valueAmount`
- `valueCurrency`

Available categories
- `Weapons`
- `Armors`
- `Adventuring gear`
- `Tools`
- `Mounts & vehicles`
- `Trade goods`
- `Magic items`
- `Poisons`
- `Herbs`

Available rarities
- `None`
- `Common`
- `Uncommon`
- `Rare`
- `Very Rare`
- `Legendary`
- `Artifact`

Available type
- `None`
- `Ring`
- `Weapon`
- `Armor`
- `Wand`
- `Staff`
- `Wondrous item`
- `Scroll`
- `Potion`
- `Rod`
- `Plant`
- `Venom`
- `Toxin`
- `Mixture`
- `Altering`
- `Antidote`
- `Healing`
- `Booster`
- `Fortifying`

Example:

```csv
name;url;level;category;rarity;magic;valueAmount;valueCurrency
Short Sword;https://example.com;1;Weapon;Common;no;9;sp
Healing Potion;https://example.com;1;Consumable;Common;yes;4;gp
```

#### Available currencies

- `cp`
- `sp`
- `ep`
- `gp`
- `pp`
