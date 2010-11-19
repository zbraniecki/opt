from django.shortcuts import render_to_response

def index(request):
    questions = [
      ['Czy powinien w Warszawie powstac pomnik smolenski?',
       [2,1,-1],
      ],
      ['Centrum powinno byc bardziej dla pieszych niz dla samochodow',
       [2,1,-1],
      ],
      ['Lubie czerwony',
       [1,1,1],
      ],
    ];
    candidates = [
      'HGW',
      'Bielecki',
      'Olejniczak',
    ];
    return render_to_response('agora/index.html', {'questions':  questions,
                                                   'candidates': candidates})
