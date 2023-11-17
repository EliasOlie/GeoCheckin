# TODO:

- [ ] Colocar os campos do update user como opcionais
- [ ] Níveis de acesso

## Níveis de acesso:

Para o melhor fluxo da aplicação é necessário controlar o que cada usuário pode fazer, autorização, e nesse caso em específico, para o cadastro de instalações, o usuário comum não pode cadastrar uma a localização, pois, dessa maneira ele cadastraria em casa e bateria o ponto de casa, apenas usuários com as permissões corretas podem cadastrar uma instalação, para isso teremos:

* Usuário comum (USER)
* Gerente (MANAGER)

Dessa forma apenas o usuário gerente pode cadastrar uma instalação com localização

