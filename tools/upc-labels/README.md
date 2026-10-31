# UPC label sheets (6 x 4 in)

Makes printable barcode labels: a 5-word title above a 1-inch UPC/EAN barcode, digits below.
12 labels per 6x4 sheet (4 across, 3 down).

## Steps
1. Edit `items.py`: `ITEMS` is a list of `(title, upc)`. Titles = first 5 words of the product title. Only products with a UPC.
2. Check digits: the script does not validate them. 12-digit UPC-A is shown as EAN-13 with a leading 0.
3. `python3 build.py` writes `labels.html` (4 sheets for 43 items).
4. `node pdf.mjs` (needs Playwright with `/opt/pw-browsers/chromium`) writes `upc-labels-6x4.pdf` and `page1.png`.
5. Attach the PDF to the user. Remind them to check printer margins.

Note: the script writes the generated files to the current directory. Run it from this folder.
