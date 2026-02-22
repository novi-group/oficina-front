# Guia de Desenvolvimento - Copilot Instructions

---

## #controllers
*applyTo*: app/Http/Controllers/**/*.php

### Padrões Obrigatórios
- Seguir padrão RESTful: index, store, update, destroy
- Usar Form Request para validação (validar no controller apenas em casos simples)
- Delegar lógica de negócio para Services ou Models
- Variáveis internas sempre em snake_case
- Retornar JSON para APIs: response()->json()
- Retornar views para páginas: view()
- Tratar erros com try/catch ou abort_if()
- Documentar todas as funções com PHPDoc e em inglês

### Exemplo Correto
php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Services\UserService;
use App\Models\User;

class UserController extends Controller
{
    protected UserService $user_service;

    public function __construct(UserService $user_service)
    {
        $this->user_service = $user_service;
    }

    /**
     * Exibe a listagem de usuários.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $users = User::paginate(15);
        return view('users.index', compact('users'));
    }

    /**
     * Armazena um novo usuário.
     *
     * @param StoreUserRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreUserRequest $request)
    {
        try {
            $user = $this->user_service->create($request->validated());
            return response()->json(['success' => true, 'data' => $user], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Atualiza um usuário existente.
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $updated_user = $this->user_service->update($user, $request->validated());
            return response()->json(['success' => true, 'data' => $updated_user]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove um usuário.
     *
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(User $user)
    {
        abort_if(!$user->canBeDeleted(), 403, 'Usuário não pode ser deletado');
        
        $user->delete();
        return response()->json(['success' => true, 'message' => 'Usuário deletado']);
    }
}


---

## #form-requests
*applyTo*: app/Http/Requests/**/*.php

### Padrões Obrigatórios
- Sempre criar Form Request para validação
- Implementar authorize() e rules()
- Adicionar messages() personalizadas quando necessário
- quando se tratar de validações únicas pode deixar no controller

### Exemplo Correto
php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'email.unique' => 'Este email já está em uso',
            'password.min' => 'A senha deve ter no mínimo 8 caracteres',
        ];
    }
}


---

## #services
*applyTo*: app/Services/**/*.php

### Padrões Obrigatórios
- Toda lógica de negócio deve estar em Services
- Variáveis em snake_case
- Documentar todas as funções com PHPDoc e em inglês
- Retornar tipos específicos (type hints)

### Exemplo Correto
php
<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Cria um novo usuário.
     *
     * @param array $data
     * @return User
     */
    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        return User::create($data);
    }

    /**
     * Atualiza um usuário existente.
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function update(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        $user->update($data);
        return $user->fresh();
    }

    /**
     * Verifica se o usuário pode ser deletado.
     *
     * @param User $user
     * @return bool
     */
    public function canDelete(User $user): bool
    {
        return $user->orders()->count() === 0;
    }
}


---

## #migrations
*applyTo*: database/migrations/**/*.php

### Padrões Obrigatórios
- Nomear migrations de forma descritiva: create_users_table, add_status_to_orders_table
- Sempre incluir timestamps()
- Criar foreign keys quando necessário com constrained()->onDelete('cascade')
- Usar nomes claros em tabelas e colunas (snake_case)
- Implementar up() e down()
- Sempre perguntar ao usuário para criar a migration 
- Sempre criar migration via terminal e nunca de forma direta

### Exemplo Correto - Criar Tabela
php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};


### Exemplo Correto - Adicionar Coluna
php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('tracking_code')->nullable()->after('order_number');
            $table->index('tracking_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['tracking_code']);
            $table->dropColumn('tracking_code');
        });
    }
};


---

## #blade
*applyTo*: resources/views/**/*.blade.php

### Padrões Obrigatórios
- Usar layouts com @extends e @section
- NUNCA usar CSS inline ou JS inline
- Sempre escapar variáveis com {{ }}
- Evitar lógica complexa na view
- Usar Blade Components para reutilização
- Organizar views em pastas: users/index.blade.php
- Usar @push('scripts') para scripts específicos

### Exemplo Correto - Layout
blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'App')</title>
    @vite(['resources/scss/app.scss', 'resources/js/app.js'])
</head>
<body>
    <div class="app-container">
        @include('partials.navbar')
        
        <main class="app-main">
            @yield('content')
        </main>
        
        @include('partials.footer')
    </div>
    @stack('scripts')
</body>
</html>


### Exemplo Correto - View
blade
{{-- resources/views/users/index.blade.php --}}
@extends('layouts.app')

@section('title', 'Usuários')

@section('content')
<div class="users-container">
    <h1 class="users-container__title">Listagem de Usuários</h1>
    
    <div class="users-container__actions">
        <button class="btn btn--primary" data-action="create-user">
            Novo Usuário
        </button>
    </div>

    <table class="users-table">
        <thead class="users-table__head">
            <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody class="users-table__body">
            @forelse($users as $user)
                <tr data-user-id="{{ $user->id }}">
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>
                        <button class="btn btn--edit" data-action="edit-user">Editar</button>
                        <button class="btn btn--delete" data-action="delete-user">Excluir</button>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="3">Nenhum usuário encontrado</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{ $users->links() }}
</div>
@endsection

@push('scripts')
    @vite('resources/js/users.js')
@endpush


### Exemplo Correto - Component
blade
{{-- resources/views/components/alert.blade.php --}}
@props(['type' => 'info', 'message'])

<div class="alert alert--{{ $type }}" {{ $attributes }}>
    <span class="alert__icon"></span>
    <p class="alert__message">{{ $message }}</p>
</div>

{{-- Uso --}}
<x-alert type="success" message="Operação realizada com sucesso!" />


---

## #javascript
*applyTo*: resources/js/**/*.js

### Padrões Obrigatórios
- Priorizar jQuery sobre manipulação DOM pura
- Usar let e const, NUNCA var
- Usar arrow functions () => {} sempre que possível
- Event delegation: $('body').on('event', 'selector', () => {})
- Iniciar scripts com $(() => { ... })
- Sempre tratar erros em AJAX
- Incluir CSRF token em requisições
- Documentar funções com JSDoc
- Encapsular funções para evitar repetição
- Criar arquivos .js separados para módulos específicos

### Exemplo Correto - Estrutura Base
javascript
// resources/js/users.js

/**
 * Gerencia as ações da página de usuários
 */
$(() => {
    initUserActions();
    initUserDelete();
});

/**
 * Inicializa as ações de criação e edição de usuários
 */
const initUserActions = () => {
    $('body').on('click', '[data-action="create-user"]', () => {
        openUserModal();
    });

    $('body').on('click', '[data-action="edit-user"]', () => {
        const user_id = $(this).closest('tr').data('user-id');
        loadUserData(user_id);
    });
};

/**
 * Inicializa a ação de exclusão de usuários
 */
const initUserDelete = () => {
    $('body').on('click', '[data-action="delete-user"]', () => {
        const user_id = $(this).closest('tr').data('user-id');
        confirmDeleteUser(user_id);
    });
};

/**
 * Carrega os dados de um usuário específico
 * @param {number} user_id - ID do usuário
 */
const loadUserData = (user_id) => {
    $.ajax({
        url: `/api/users/${user_id}`,
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: (response) => {
            populateUserForm(response.data);
        },
        error: (xhr) => {
            toastr.error('Erro ao carregar dados do usuário');
        }
    });
};

/**
 * Confirma e executa a exclusão de um usuário
 * @param {number} user_id - ID do usuário a ser excluído
 */
const confirmDeleteUser = (user_id) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return;

    $.ajax({
        url: `/api/users/${user_id}`,
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: (response) => {
            toastr.success(response.message);
            $(`tr[data-user-id="${user_id}"]`).fadeOut(300, function() {
                $(this).remove();
            });
        },
        error: (xhr) => {
            toastr.error(xhr.responseJSON?.message || 'Erro ao excluir usuário');
        }
    });
};

/**
 * Popula o formulário com dados do usuário
 * @param {Object} user - Dados do usuário
 */
const populateUserForm = (user) => {
    $('#user-name').val(user.name);
    $('#user-email').val(user.email);
    $('#user-modal').modal('show');
};

/**
 * Abre o modal de criação de usuário
 */
const openUserModal = () => {
    $('#user-form')[0].reset();
    $('#user-modal').modal('show');
};


### Exemplo Correto - Formulário AJAX
javascript
// resources/js/forms/user-form.js

/**
 * Gerencia o envio do formulário de usuário
 */
$(() => {
    initUserFormSubmit();
});

/**
 * Inicializa o envio do formulário via AJAX
 */
const initUserFormSubmit = () => {
    $('body').on('submit', '#user-form', (e) => {
        e.preventDefault();
        submitUserForm($(e.currentTarget));
    });
};

/**
 * Submete o formulário de usuário via AJAX
 * @param {jQuery} $form - Elemento jQuery do formulário
 */
const submitUserForm = ($form) => {
    const form_data = new FormData($form[0]);
    const url = $form.attr('action');
    const method = $form.attr('method');

    $.ajax({
        url: url,
        method: method,
        data: form_data,
        processData: false,
        contentType: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        beforeSend: () => {
            disableFormSubmit($form);
            clearFormErrors($form);
        },
        success: (response) => {
            toastr.success('Usuário salvo com sucesso!');
            $('#user-modal').modal('hide');
            window.location.reload();
        },
        error: (xhr) => {
            if (xhr.status === 422) {
                displayValidationErrors($form, xhr.responseJSON.errors);
            } else {
                toastr.error('Erro ao salvar usuário');
            }
        },
        complete: () => {
            enableFormSubmit($form);
        }
    });
};

/**
 * Desabilita o botão de submit do formulário
 * @param {jQuery} $form - Elemento jQuery do formulário
 */
const disableFormSubmit = ($form) => {
    $form.find('button[type="submit"]').prop('disabled', true).addClass('btn--loading');
};

/**
 * Habilita o botão de submit do formulário
 * @param {jQuery} $form - Elemento jQuery do formulário
 */
const enableFormSubmit = ($form) => {
    $form.find('button[type="submit"]').prop('disabled', false).removeClass('btn--loading');
};

/**
 * Remove erros de validação do formulário
 * @param {jQuery} $form - Elemento jQuery do formulário
 */
const clearFormErrors = ($form) => {
    $form.find('.form-control--error').removeClass('form-control--error');
    $form.find('.form-error-message').remove();
};

/**
 * Exibe erros de validação no formulário
 * @param {jQuery} $form - Elemento jQuery do formulário
 * @param {Object} errors - Objeto com erros de validação
 */
const displayValidationErrors = ($form, errors) => {
    Object.keys(errors).forEach(field => {
        const $input = $form.find(`[name="${field}"]`);
        const error_message = errors[field][0];
        
        $input.addClass('form-control--error');
        $input.after(`<span class="form-error-message">${error_message}</span>`);
    });
};


---

## #scss
*applyTo*: resources/scss/**/*.scss

### Padrões Obrigatórios
- NUNCA usar CSS inline em Blade ou JS
- Criar APENAS arquivos SCSS (não usar CSS puro)
- Estruturar em módulos: _buttons.scss, _layout.scss, _forms.scss
- Sempre importar SCSS no Vite
- Usar padrão BEM (Block, Element, Modifier)
- Usar variáveis para cores, espaçamentos e fontes

---

## #vite
*applyTo*: vite.config.js

### Padrões Obrigatórios
- Sempre registrar novos arquivos JS/SCSS/blade no Vite
- Importar arquivos na ordem correta

---

## #helpers
*applyTo*: app/Helpers/**/*.php

### Padrões Obrigatórios
- Criar funções helpers para reutilização
- Sempre documentar com PHPDoc e inglês
- Usar snake_case para nomes de funções

### Exemplo Correto
php
<?php

// app/Helpers/helpers.php

if (!function_exists('format_currency')) {
    /**
     * Formata um valor para moeda brasileira.
     *
     * @param float $value
     * @return string
     */
    function format_currency(float $value): string
    {
        return 'R$ ' . number_format($value, 2, ',', '.');
    }
}

if (!function_exists('format_date')) {
    /**
     * Formata uma data para o padrão brasileiro.
     *
     * @param string $date
     * @return string
     */
    function format_date(string $date): string
    {
        return \Carbon\Carbon::parse($date)->format('d/m/Y');
    }
}

if (!function_exists('format_phone')) {
    /**
     * Formata um telefone para o padrão brasileiro.
     *
     * @param string $phone
     * @return string
     */
    function format_phone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        if (strlen($phone) === 11) {
            return preg_replace('/(\d{2})(\d{5})(\d{4})/', '($1) $2-$3', $phone);
        }
        
        return preg_replace('/(\d{2})(\d{4})(\d{4})/', '($1) $2-$3', $phone);
    }
}


---

## #models
*applyTo*: app/Models/**/*.php

### Padrões Obrigatórios
- Definir $fillable ou $guarded
- Usar $casts para conversão de tipos
- Documentar relationships
- Criar scopes quando necessário
- Usar accessors/mutators para formatação

### Exemplo Correto
php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    /**
     * Relacionamento com usuário.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relacionamento com itens do pedido.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Scope para pedidos pendentes.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope para pedidos completos.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Verifica se o pedido pode ser cancelado.
     *
     * @return bool
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    /**
     * Formata o valor total para exibição.
     *
     * @return string
     */
    public function getFormattedTotalAttribute(): string
    {
        return 'R$ ' . number_format($this->total_amount, 2, ',', '.');
    }
}


---

## #routes
*applyTo*: routes/**/*.php

### Padrões Obrigatórios
- Agrupar rotas relacionadas
- Usar resource para CRUDs completos
- Nomear rotas com name()

### Exemplo Correto
php
<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    // Users CRUD
    Route::resource('users', UserController::class);

    // Orders
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::post('/', [OrderController::class, 'store'])->name('store');
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        Route::put('/{order}', [OrderController::class, 'update'])->name('update');
        Route::delete('/{order}', [OrderController::class, 'destroy'])->name('destroy');
        Route::post('/{order}/cancel', [OrderController::class, 'cancel'])->name('cancel');
    });
});

// API Routes
Route::prefix('api')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::get('/orders/pending', [OrderController::class, 'pending']);
});


---

## #git-commits
*applyTo*: Todos os commits do projeto

### Padrões Obrigatórios
- Usar convenção de commits semântica
- Commits em inglês
- Mensagens descritivas e claras

### Tipos de Commit
- feat: Nova funcionalidade
- fix: Correção de bug
- refactor: Refatoração de código
- style: Mudanças de estilo/formatação
- docs: Documentação
- test: Testes
- chore: Tarefas de manutenção

### Exemplos Corretos
```bash
git commit -m "feat: adiciona crud de usuários"
git commit -m "fix: corrige validação de email duplicado"
git commit -m