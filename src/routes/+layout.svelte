<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { invalidate, preloadData } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;

  $: ({ session, profile } = data);
  $: currentPath = $page.url.pathname;

  let mobileMenuOpen = false;

  // Dynamic nav links based on auth state
  $: navLinks = session
    ? [
        { href: '/course', label: 'Course' },
        { href: '/profile', label: 'Profile' },
        ...(profile?.role === 'admin' ? [{ href: '/admin-dashboard', label: 'Admin' }] : [])
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/login', label: 'Login' }
      ];

  // Eagerly preload main navigation pages for instant navigation
  $: if (session && typeof window !== 'undefined') {
    // Preload after a short delay to not block initial page load
    setTimeout(() => {
      preloadData('/course').catch(() => {});
      preloadData('/profile').catch(() => {});
      if (profile?.role === 'admin') {
        preloadData('/admin-dashboard').catch(() => {});
      }
    }, 100);
  }

  async function handleSignOut() {
    const { error } = await data.supabase.auth.signOut();
    if (!error) {
      invalidate('supabase:auth');
      window.location.href = '/';
    }
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  onMount(() => {
    const { data: authData } = data.supabase.auth.onAuthStateChange((event, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => {
      authData.subscription.unsubscribe();
    };
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen" style="{currentPath === '/' ? '' : 'background-color: var(--cream-light);'}">
  {#if currentPath !== '/'}
    <!-- Navigation Bar - Hidden on homepage -->
    <nav class="sticky top-0 z-40 border-b" style="background: var(--cream-light); border-color: var(--border-light);">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <!-- Logo/Brand -->
          <div class="flex-shrink-0">
            <a
              href="/"
              data-sveltekit-preload-data="tap"
              class="block transition-opacity hover:opacity-80"
            >
              <img
                src="/w1w-logo.png"
                alt="Website 1 Wun"
                class="h-8 sm:h-10 w-auto"
              />
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-1">
            {#each navLinks as link}
              <a
                href={link.href}
                data-sveltekit-preload-data="hover"
                class="px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style="{currentPath === link.href
                  ? 'background-color: var(--golden); color: var(--dark);'
                  : 'color: var(--text-secondary);'}"
                on:mouseenter={(e) => {
                  if (currentPath !== link.href) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }
                }}
                on:mouseleave={(e) => {
                  if (currentPath !== link.href) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.label}
              </a>
            {/each}

            {#if session && profile}
              <button
                on:click={handleSignOut}
                class="ml-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style="color: var(--text-secondary);"
                on:mouseenter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                on:mouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Sign Out
              </button>
            {/if}
          </div>

          <!-- Mobile Menu Button -->
          <button
            on:click={toggleMobileMenu}
            class="md:hidden p-2 -mr-2 rounded-lg transition-colors"
            style="color: var(--text-secondary);"
            on:mouseenter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            on:mouseleave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Toggle menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {#if mobileMenuOpen}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              {/if}
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation Menu -->
        {#if mobileMenuOpen}
          <div class="md:hidden py-3 space-y-1" style="border-top: 1px solid var(--border-light);">
            {#each navLinks as link}
              <a
                href={link.href}
                on:click={closeMobileMenu}
                data-sveltekit-preload-data="tap"
                class="block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style="{currentPath === link.href
                  ? 'background-color: var(--golden); color: var(--dark);'
                  : 'color: var(--text-secondary);'}"
              >
                {link.label}
              </a>
            {/each}

            {#if session && profile}
              <button
                on:click={() => { handleSignOut(); closeMobileMenu(); }}
                class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style="color: var(--text-secondary);"
              >
                Sign Out
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </nav>
  {/if}

  <!-- Main Content -->
  {#if currentPath === '/'}
    <!-- Homepage - Full width, no padding -->
    <main>
      <slot />
    </main>
  {:else}
    <!-- Other pages - Constrained width with padding -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <slot />
    </main>
  {/if}
</div>
