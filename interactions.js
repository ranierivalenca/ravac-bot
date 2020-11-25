module.exports = {
    // welcome
    'welcome': username => ({
        'color': '#ff9900',
        'title': `Oi, ${username}! Bem vind_x_ ao servidor do Professor Ranieri`,
        'description': 'Eu sou o **RaVaC **, um dos bots do professor, e minha função aqui é organizar a casa.\n\nPra isso, vou precisar te fazer algumas perguntas rápidas, para poder te colocar no lugar certo aqui nesse servidor.\n\nMas olha só, não se preocupa se errar, depois eu explico como ajeitar, ok?\n\nAgora vamos às perguntas!',
        'footer': {
            'text': 'by Ranieri Valença'
        }
    }),
    'askName': {
        'title': 'Primeiro, preciso saber o seu nome',
        'description': '(não é o apelido, hein?)'
    },
    'askName.error': username => ({
        'title': `Oi, ${username}... espero que você não esteja me ignorando :cry:`,
        'description': 'Preciso saber seu nome e outras informações pra poder te dar as autorizações necessárias aqui aqui no servidor... Diz teu nome aí por favor ;)'
    }),



    'isStudent': {
        'title': 'Muito obrigado :heart_eyes: Agora me responde, vc estuda no **IFPE - Campus Igarassu**?',
        'fields': [
            {
                'name': 'sim',
                'value': 'digite `s` ou `sim`',
                'inline': true
            },
            {
                'name': 'não',
                'value': 'digite `n` ou `não`',
                'inline': true
            }
        ]
    },
    'isStudent.error': (expired, realName) => ({
        'title': expired ? `Oi, ${realName}... espero que você não esteja me ignorando :cry:` : 'Eita, não entendi tua resposta... :sweat:',
        'description': 'Eu preciso saber se vc estuda no **Campus Igarassu** do **IFPE** :pleading_face:',
        'fields': [
            {
                'name': 'sim',
                'value': 'digite `s` ou `sim`',
                'inline': true
            },
            {
                'name': 'não',
                'value': 'digite `n` ou `não`',
                'inline': true
            }
        ]
    }),

    'askCourse': {
        'title': 'Aee!! Quase acabando',
        'description': 'Qual teu curso?',
        'fields': [
            {
                'name': 'Técnico em Informática para Internet',
                'value': 'digite `ipi`',
                'inline': true
            },
            {
                'name': 'Tecnológico em Sistemas para Internet',
                'value': 'digite `tsi`',
                'inline': true
            },
            {
                'name': 'Outro curso',
                'value': 'digite `0`',
                'inline': true
            }
        ]
    },
    'askCourse.error': (expired, realName) => ({
        'title': expired ? `Oi, ${realName}... espero que você não esteja me ignorando :cry:` : 'Eita, não entendi tua resposta... :sweat:',
        'description': 'Preciso saber qual teu curso no Campus pra continuar esse processo :pleading_face:',
        'fields': [
            {
                'name': 'Técnico em Informática para Internet',
                'value': 'digite `ipi`',
                'inline': true
            },
            {
                'name': 'Tecnológico em Sistemas para Internet',
                'value': 'digite `tsi`',
                'inline': true
            },
            {
                'name': 'Outro curso',
                'value': 'digite `0`',
                'inline': true
            }
        ]
    }),


    'askSemester': {
        'title': ':partying_face: Última perguntaa!!!',
        'description': 'Qual o ano/semestre que vc ingressou no curso? Digita o `ano.semestre`, tipo assim:',
        'fields': [
            {'name': 'Segundo semestre (segunda entrada) de 2020', 'value': 'digita `2020.2`', 'inline': true},
            {'name': 'Primeiro semestre de 2020', 'value': 'digita `2020.1`', 'inline': true},
            {'name': 'Segundo semestre de 2019', 'value': 'digita `2019.2`', 'inline': true},
            {'name': '...', 'value': 'digita `ANO.ENTRADA`', 'inline': true},
        ]
    },
    'askSemester.error': (expired, realName) => ({
        'title': expired ? `Oi, ${realName}... espero que você não esteja me ignorando :cry:` : 'Eita, não entendi tua resposta... :sweat:',
        'description': 'Preciso saber o ano e semestre que vc ingressou no curso no formato `ano.semestre`, tipo assim:',
        'fields': [
            {'name': 'Segundo semestre (segunda entrada) de 2020', 'value': 'digita `2020.2`', 'inline': true},
            {'name': 'Primeiro semestre de 2020', 'value': 'digita `2020.1`', 'inline': true},
            {'name': 'Segundo semestre de 2019', 'value': 'digita `2019.2`', 'inline': true},
            {'name': 'Primeiro semestre de 2019', 'value': 'digita `2019.1`', 'inline': true},
            {'name': 'Segundo semestre de 2018', 'value': 'digita `2018.2`', 'inline': true},
            {'name': '...', 'value': 'digita `ANO.ENTRADA`', 'inline': true},
        ]
    })
}