let naoTerminais = ['S', 'A', 'B', 'C'];

let gramatica = {
    'S': ['bA', 'cA'],
    'A': ['aBa', 'bC'],
    'B': ['bSc', 'cA'],
    'C': ['bAa', '&']
};

let parsingTable = {
    'S': { 'b': ['b', 'A'], 'c': ['c', 'A'] },
    'A': { 'a': ['a', 'B', 'a'], 'b': ['b', 'C'], 'c': ['c', 'C'] },
    'B': { 'b': ['b', 'S', 'c'], 'c': ['c', 'A'] },
    'C': { 'a': ['&'], 'b': ['b', 'A', 'a'], 'c': ['&'], '$': ['&'] }
};
