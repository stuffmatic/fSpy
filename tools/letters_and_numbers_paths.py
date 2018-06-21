import json
from xml.dom.minidom import parse, parseString

dom = parse('assets/master/lettersandnumbers.svg')
groups = dom.getElementsByTagName('g')
group_ids = ['gx', 'gy', 'gz', 'g1', 'g2', 'g3']
coord_lists_by_id = {}
for group in groups:
    id = group.attributes['id'].value
    if id in group_ids:
        x_min = 1000000
        x_max = -1000000
        y_min = 1000000
        y_max = -1000000
        print 'processing group', id
        coord_lists = []
        paths = group.getElementsByTagName('path')
        for path in paths:
            coords = []
            d = path.attributes['d'].value
            print '  processing subpath', d
            parts = d.split(' ')
            for part in parts:
                if len(part.split(',')) == 2:
                    x, y = part.split(',')
                    x = float(x)
                    y = float(y)
                    coords.append((x, y))
                    if x < x_min:
                        x_min = x
                    if x > x_max:
                        x_max = x
                    if y < y_min:
                        y_min = y
                    if y > y_max:
                        y_max = y
            coord_lists.append(coords)

        scale = 1.0 / (y_max - y_min)
        scaled_coord_lists = []
        for coord_list in coord_lists:
            scaled_coord_list = []
            for coord in coord_list:
                scaled_coord_list.append(
                    (
                        (coord[0] - 0.5 * (x_max + x_min)) * scale,
                        (coord[1] - 0.5 * (y_max + y_min)) * scale
                    )
                )
            scaled_coord_lists.append(scaled_coord_list)

        coord_lists_by_id[id[1]] = scaled_coord_lists

#print coord_lists_by_id
print json.dumps(coord_lists_by_id, indent=2, sort_keys=True)

