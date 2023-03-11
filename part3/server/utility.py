def convertBody(body, format):
    result = {}
    
    for item in format.keys():
        path = format[item].split('.')

        optional = False
        if(item[-1] == '?'):
            optional = True
            item = item[:-1]

        value = body
        for subpath in path:
            if(subpath in value.keys()):
                value = value[subpath]
            elif optional:
                value = None
                break
            else:
                return False
        
        result[item] = value
    
    return result