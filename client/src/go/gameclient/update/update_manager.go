package update

type Update struct {
	fn     func()
	name   string
	oneOff bool
}

type Manager struct {
	updates map[string]*Update
	renders map[string]*Update
}

func NewManager() *Manager {
	return &Manager{
		updates: make(map[string]*Update),
		renders: make(map[string]*Update),
	}
}

func (m *Manager) AddRenderFunc(name string, f func(), oneOff bool) {
	m.renders[name] = &Update{
		fn:     f,
		name:   name,
		oneOff: oneOff,
	}
}

func (m *Manager) ProcessRenders() {
	for name, update := range m.renders {
		update.fn()
		if update.oneOff {
			delete(m.renders, name)
		}
	}
}

func (m *Manager) AddUpdateFunc(name string, f func(), oneOff bool) {
	m.updates[name] = &Update{
		fn:     f,
		name:   name,
		oneOff: oneOff,
	}
}

func (m *Manager) ProcessUpdates() {
	for name, update := range m.updates {
		update.fn()
		if update.oneOff {
			delete(m.updates, name)
		}
	}
}
